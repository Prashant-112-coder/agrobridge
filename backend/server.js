// ============================================================
// AGROBRIDGE AI - BACKEND SERVER
// Handles farm analysis, satellite NDVI, soil, weather and decisions
// ============================================================

import express from "express";
import cors from "cors";
import ee from "@google/earthengine";
import fs from "fs";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;
const PROJECT_ID = "agrobridge-ai";

let privateKey;

if (process.env.EE_PRIVATE_KEY) {
  privateKey = JSON.parse(process.env.EE_PRIVATE_KEY);
} else {
  privateKey = JSON.parse(fs.readFileSync("./.private-key.json", "utf8"));
}

ee.data.authenticateViaPrivateKey(
  privateKey,
  () => {
    console.log("Earth Engine authentication successful.");
    ee.initialize(
      null,
      null,
      () => {
        console.log("Earth Engine initialized successfully.");
        startServer();
      },
      (error) => {
        console.error("Earth Engine initialization failed:", error);
      },
      null,
      PROJECT_ID
    );
  },
  (error) => {
    console.error("Earth Engine authentication failed:", error);
  }
);

function startServer() {
  app.get("/", (req, res) => {
    res.json({ message: "AGROBRIDGE AI Backend is running" });
  });

  // ==========================================================
  // FARM ANALYSIS - SENTINEL-2 + NDVI
  // ==========================================================
  app.post("/api/farm", (req, res) => {
    const { latitude, longitude, crop } = req.body;
    console.log("Farm received:", { latitude, longitude, crop });

    if (!latitude || !longitude) {
      return res.status(400).json({ success: false, message: "Latitude and longitude are required." });
    }

    try {
      const farm = ee.Geometry.Point([Number(longitude), Number(latitude)]);
      const images = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
        .filterBounds(farm)
        .filterDate("2025-01-01", "2026-08-19")
        .filter(ee.Filter.lt("CLOUDY_PIXEL_PERCENTAGE", 20))
        .sort("system:time_start", false);

      const image = images.first();
      const ndvi = image.normalizedDifference(["B8", "B4"]).rename("NDVI");
      const result = ndvi.reduceRegion({
        reducer: ee.Reducer.mean(),
        geometry: farm.buffer(500),
        scale: 10,
        maxPixels: 1e9
      });

      result.evaluate((data, error) => {
        if (error) {
          console.error("NDVI calculation failed:", error);
          return res.status(500).json({ success: false, message: "NDVI calculation failed." });
        }
        const ndviValue = data.NDVI;
        console.log("NDVI:", ndviValue);
        res.json({
          success: true,
          farm: { latitude: Number(latitude), longitude: Number(longitude), crop: crop || "Unknown" },
          satellite: { ndvi: ndviValue }
        });
      });
    } catch (error) {
      console.error("Farm analysis error:", error);
      res.status(500).json({ success: false, message: "Farm analysis failed." });
    }
  });

  // ==========================================================
  // SOIL INTELLIGENCE
  // ==========================================================
  app.post("/api/soil", (req, res) => {
    const { latitude, longitude } = req.body;
    console.log("Soil request:", { latitude, longitude });

    if (!latitude || !longitude) {
      return res.status(400).json({ success: false, message: "Latitude and longitude are required." });
    }

    try {
      const location = ee.Geometry.Point([Number(longitude), Number(latitude)]);
      const phImage = ee.Image("OpenLandMap/SOL/SOL_PH-H2O_USDA-4C1A2A_M/v02").select("b0");
      const carbonImage = ee.Image("OpenLandMap/SOL/SOL_ORGANIC-CARBON_USDA-6A1C_M/v02").select("b0");
      const soilImage = phImage.addBands(carbonImage);
      const result = soilImage.reduceRegion({
        reducer: ee.Reducer.mean(),
        geometry: location,
        scale: 250,
        maxPixels: 1e9
      });

      result.evaluate((data, error) => {
        if (error) {
          console.error("Soil calculation failed:", error);
          return res.status(500).json({ success: false, message: "Soil calculation failed." });
        }

        console.log("Raw soil data:", data);
        const ph = data.b0;
        const organicCarbonRaw = data.b0_1;
        const estimatedPH = ph !== null && ph !== undefined ? Number(ph) / 10 : null;
        const estimatedOrganicCarbon = organicCarbonRaw !== null && organicCarbonRaw !== undefined ? Number(organicCarbonRaw) * 5 : null;

        res.json({
          success: true,
          source: { type: "location_based_estimate", dataset: "OpenLandMap", resolution: "250m" },
          location: { latitude: Number(latitude), longitude: Number(longitude) },
          soil: { ph: estimatedPH, organicCarbon_g_per_kg: estimatedOrganicCarbon }
        });
      });
    } catch (error) {
      console.error("Soil analysis error:", error);
      res.status(500).json({ success: false, message: "Soil analysis failed." });
    }
  });

  // ==========================================================
  // WEATHER INTELLIGENCE - current + 3-day forecast
  // Existing current-weather fields are preserved.
  // ==========================================================
  app.post("/api/weather", async (req, res) => {
    const { latitude, longitude } = req.body;
    console.log("Weather request:", { latitude, longitude });

    if (!latitude || !longitude) {
      return res.status(400).json({ success: false, message: "Latitude and longitude are required." });
    }

    try {
      const weatherUrl =
        `https://api.open-meteo.com/v1/forecast` +
        `?latitude=${latitude}` +
        `&longitude=${longitude}` +
        `&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m` +
        `&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max` +
        `&forecast_days=3` +
        `&timezone=auto`;

      const response = await fetch(weatherUrl);
      if (!response.ok) throw new Error("Weather API request failed");
      const data = await response.json();

      res.json({
        success: true,
        location: { latitude: Number(latitude), longitude: Number(longitude) },
        weather: {
          temperature: data.current.temperature_2m,
          humidity: data.current.relative_humidity_2m,
          precipitation: data.current.precipitation,
          windSpeed: data.current.wind_speed_10m,
          forecast: (data.daily?.time || []).map((date, index) => ({
            date,
            maxTemperature: data.daily.temperature_2m_max?.[index],
            minTemperature: data.daily.temperature_2m_min?.[index],
            precipitation: data.daily.precipitation_sum?.[index],
            precipitationProbability: data.daily.precipitation_probability_max?.[index]
          }))
        }
      });
    } catch (error) {
      console.error("Weather analysis failed:", error);
      res.status(500).json({ success: false, message: "Weather data unavailable." });
    }
  });

  // ==========================================================
  // FARM DECISION ENGINE
  // Deterministic, explainable decision layer using live farm data.
  // No fake values and no disease diagnosis claims.
  // ==========================================================
  app.post("/api/decision", (req, res) => {
    const { crop, cropStage, irrigation, ndvi, soilPH, temperature, humidity, precipitation, windSpeed, forecast } = req.body;
    const numeric = (value) => Number.isFinite(Number(value)) ? Number(value) : null;
    const values = {
      ndvi: numeric(ndvi), soilPH: numeric(soilPH), temperature: numeric(temperature),
      humidity: numeric(humidity), precipitation: numeric(precipitation), windSpeed: numeric(windSpeed)
    };

    const risks = [];
    const actions = [];

    if (values.ndvi !== null) {
      if (values.ndvi < 0.20) {
        risks.push({ type: "vegetation", level: "HIGH", score: 35, signal: `NDVI ${values.ndvi.toFixed(2)} is low`, reason: "Low vegetation index can indicate crop stress or sparse vegetation." });
        actions.push({ priority: 1, title: "Inspect the field soon", detail: "Check representative plants for wilting, uneven growth, irrigation issues or visible stress before changing inputs." });
      } else if (values.ndvi < 0.40) {
        risks.push({ type: "vegetation", level: "MODERATE", score: 20, signal: `NDVI ${values.ndvi.toFixed(2)} is below a healthy dense-canopy range`, reason: "Vegetation signal is weaker than expected for a dense crop canopy." });
        actions.push({ priority: 2, title: "Scout weaker patches", detail: "Compare low-growth areas with healthy areas and verify irrigation uniformity." });
      }
    }

    if (values.soilPH !== null) {
      if (values.soilPH < 5.5 || values.soilPH > 8.0) {
        risks.push({ type: "soil", level: "HIGH", score: 30, signal: `Soil pH ${values.soilPH.toFixed(1)}`, reason: "The estimated soil pH is outside a broad generally suitable range for many crops." });
        actions.push({ priority: 2, title: "Verify soil pH with a soil test", detail: "Use a recent lab test before applying lime, sulfur or other pH-correction inputs." });
      } else if (values.soilPH < 6.0 || values.soilPH > 7.5) {
        risks.push({ type: "soil", level: "MODERATE", score: 12, signal: `Soil pH ${values.soilPH.toFixed(1)}`, reason: "The estimated pH is outside a common neutral-to-slightly-acidic range." });
      }
    }

    if (values.temperature !== null) {
      if (values.temperature >= 35) {
        risks.push({ type: "heat", level: "HIGH", score: 25, signal: `${values.temperature.toFixed(1)}°C`, reason: "High temperature increases crop heat and water-stress pressure." });
        actions.push({ priority: 1, title: "Prioritize heat-stress checks", detail: "Check soil moisture and crop wilting during the hottest part of the day; avoid unnecessary field operations at peak heat." });
      } else if (values.temperature >= 32) {
        risks.push({ type: "heat", level: "MODERATE", score: 12, signal: `${values.temperature.toFixed(1)}°C`, reason: "Warm conditions can increase evapotranspiration and crop water demand." });
      }
    }

    if (values.windSpeed !== null && values.windSpeed >= 30) {
      risks.push({ type: "wind", level: "MODERATE", score: 12, signal: `${values.windSpeed.toFixed(1)} km/h`, reason: "Strong wind can increase crop water loss and make spraying operations less suitable." });
      actions.push({ priority: 3, title: "Avoid spraying in strong wind", detail: "Recheck local wind conditions before foliar or crop-protection spraying." });
    }

    const forecastRain = Array.isArray(forecast) ? forecast.reduce((sum, day) => sum + Number(day?.precipitation || 0), 0) : 0;
    const forecastRainProbability = Array.isArray(forecast) && forecast.length ? Math.max(...forecast.map((day) => Number(day?.precipitationProbability || 0))) : 0;
    if (forecastRain >= 15 || forecastRainProbability >= 70) {
      risks.push({ type: "rain", level: "MODERATE", score: 12, signal: `${forecastRain.toFixed(1)} mm forecast / ${forecastRainProbability}% max probability`, reason: "Near-term rain may change irrigation and field-operation decisions." });
      actions.push({ priority: 2, title: "Recheck irrigation before the next cycle", detail: "Consider forecast rainfall before adding irrigation, especially where soil moisture is already adequate." });
    }

    const riskScore = Math.min(100, risks.reduce((sum, item) => sum + item.score, 0));
    const level = riskScore >= 55 ? "HIGH RISK" : riskScore >= 25 ? "MODERATE RISK" : "LOW RISK";
    const sortedActions = actions.sort((a, b) => a.priority - b.priority);

    if (!sortedActions.length) {
      sortedActions.push({ priority: 3, title: "Continue routine scouting", detail: `Monitor the ${crop || "crop"}${cropStage ? ` at the ${cropStage.toLowerCase()} stage` : ""} and re-analyze when conditions change.` });
    }

    res.json({
      success: true,
      engine: "AGROBRIDGE Explainable Farm Decision Engine v1",
      risk: { score: riskScore, level },
      crop: crop || "Unknown",
      cropStage: cropStage || "Not specified",
      irrigation: irrigation || "Not specified",
      risks: risks.slice(0, 5),
      actions: sortedActions.slice(0, 4),
      summary: level === "HIGH RISK"
        ? "One or more farm signals need attention soon. Start with the highest-priority action and verify conditions in the field."
        : level === "MODERATE RISK"
          ? "Some signals deserve closer monitoring. Use the recommended checks before changing inputs."
          : "No major rule-based risk signal was detected from the supplied live measurements. Continue routine monitoring."
    });
  });

  app.listen(PORT, () => {
    console.log(`AGROBRIDGE backend running on port ${PORT}`);
  });
}
