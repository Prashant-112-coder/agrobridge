// ============================================================
// AGROBRIDGE AI - BACKEND SERVER
// Handles farm analysis, satellite NDVI, soil and weather data
// ============================================================

import express from "express";
import cors from "cors";
import ee from "@google/earthengine";
import fs from "fs";

const app = express();

// Allow frontend to communicate with backend
app.use(cors());

// Allow JSON requests from React
app.use(express.json());

const PORT = 5000;
const PROJECT_ID = "agrobridge-ai";


// ============================================================
// EARTH ENGINE AUTHENTICATION
// ============================================================

// Load Google Earth Engine service-account credentials
const privateKey = JSON.parse(
  fs.readFileSync("./.private-key.json", "utf8")
);

// Authenticate with Google Earth Engine
ee.data.authenticateViaPrivateKey(
  privateKey,

  () => {
    console.log("Earth Engine authentication successful.");

    // Initialize Earth Engine
    ee.initialize(
      null,
      null,

      () => {
        console.log("Earth Engine initialized successfully.");

        // Start API server only after Earth Engine is ready
        startServer();
      },

      (error) => {
        console.error("Earth Engine initialization failed:");
        console.error(error);
      },

      null,
      PROJECT_ID
    );
  },

  (error) => {
    console.error("Earth Engine authentication failed:");
    console.error(error);
  }
);


// ============================================================
// START BACKEND SERVER
// ============================================================

function startServer() {

  // ----------------------------------------------------------
  // HOME ROUTE
  // Used to check whether the backend is alive
  // ----------------------------------------------------------

  app.get("/", (req, res) => {
    res.json({
      message: "AGROBRIDGE AI Backend is running"
    });
  });


  // ==========================================================
  // FARM ANALYSIS - SENTINEL-2 + NDVI
  // ==========================================================

  app.post("/api/farm", (req, res) => {

    const {
      latitude,
      longitude,
      crop
    } = req.body;

    console.log("Farm received:", {
      latitude,
      longitude,
      crop
    });


    // Check whether location was provided
    if (!latitude || !longitude) {

      return res.status(400).json({
        success: false,
        message: "Latitude and longitude are required."
      });

    }


    try {

      // Create farm location
      const farm = ee.Geometry.Point([
        Number(longitude),
        Number(latitude)
      ]);


      // ------------------------------------------------------
      // Search Sentinel-2 satellite images
      // ------------------------------------------------------

      const images = ee.ImageCollection(
        "COPERNICUS/S2_SR_HARMONIZED"
      )
        .filterBounds(farm)

        // Search available images
        .filterDate(
          "2025-01-01",
          "2026-08-19"
        )

        // Avoid highly cloudy images
        .filter(
          ee.Filter.lt(
            "CLOUDY_PIXEL_PERCENTAGE",
            20
          )
        )

        // Latest image first
        .sort(
          "system:time_start",
          false
        );


      // Get latest available satellite image
      const image = images.first();


      // ------------------------------------------------------
      // Calculate NDVI
      //
      // NDVI = (NIR - RED) / (NIR + RED)
      //
      // Sentinel-2:
      // B8 = Near Infrared
      // B4 = Red
      // ------------------------------------------------------

      const ndvi = image
        .normalizedDifference([
          "B8",
          "B4"
        ])
        .rename("NDVI");


      // Calculate average NDVI around farm
      const result = ndvi.reduceRegion({

        reducer: ee.Reducer.mean(),

        geometry: farm.buffer(500),

        scale: 10,

        maxPixels: 1e9

      });


      // Get result from Earth Engine
      result.evaluate((data, error) => {

        if (error) {

          console.error(
            "NDVI calculation failed:",
            error
          );

          return res.status(500).json({
            success: false,
            message: "NDVI calculation failed."
          });

        }


        const ndviValue = data.NDVI;

        console.log(
          "NDVI:",
          ndviValue
        );


        // Send NDVI to React frontend
        res.json({

          success: true,

          farm: {
            latitude: Number(latitude),
            longitude: Number(longitude),
            crop: crop || "Unknown"
          },

          satellite: {
            ndvi: ndviValue
          }

        });

      });


    } catch (error) {

      console.error(
        "Farm analysis error:",
        error
      );

      res.status(500).json({
        success: false,
        message: "Farm analysis failed."
      });

    }

  });


  // ==========================================================
  // SOIL INTELLIGENCE
  // Uses OpenLandMap through Google Earth Engine
  // ==========================================================

  app.post("/api/soil", (req, res) => {

    const {
      latitude,
      longitude
    } = req.body;


    console.log("Soil request:", {
      latitude,
      longitude
    });


    // Check location
    if (!latitude || !longitude) {

      return res.status(400).json({
        success: false,
        message: "Latitude and longitude are required."
      });

    }


    try {

      // Create farm location
      const location = ee.Geometry.Point([
        Number(longitude),
        Number(latitude)
      ]);


      // ------------------------------------------------------
      // OpenLandMap Soil pH
      // ------------------------------------------------------

      const phImage = ee.Image(
        "OpenLandMap/SOL/SOL_PH-H2O_USDA-4C1A2A_M/v02"
      ).select("b0");


      // ------------------------------------------------------
      // OpenLandMap Organic Carbon
      // ------------------------------------------------------

      const carbonImage = ee.Image(
        "OpenLandMap/SOL/SOL_ORGANIC-CARBON_USDA-6A1C_M/v02"
      ).select("b0");


      // Combine soil layers
      const soilImage =
        phImage.addBands(carbonImage);


      // Extract soil information
      const result = soilImage.reduceRegion({

        reducer: ee.Reducer.mean(),

        geometry: location,

        scale: 250,

        maxPixels: 1e9

      });


      // Get Earth Engine result
      result.evaluate((data, error) => {

        if (error) {

          console.error(
            "Soil calculation failed:",
            error
          );

          return res.status(500).json({
            success: false,
            message: "Soil calculation failed."
          });

        }


        console.log(
          "Raw soil data:",
          data
        );


        const ph = data.b0;

        const organicCarbonRaw =
          data.b0_1;


        // OpenLandMap pH scaling
        const estimatedPH =
          ph !== null &&
          ph !== undefined
            ? Number(ph) / 10
            : null;


        // OpenLandMap organic carbon scaling
        const estimatedOrganicCarbon =
          organicCarbonRaw !== null &&
          organicCarbonRaw !== undefined
            ? Number(organicCarbonRaw) * 5
            : null;


        // Send soil information to frontend
        res.json({

          success: true,

          source: {
            type: "location_based_estimate",
            dataset: "OpenLandMap",
            resolution: "250m"
          },

          location: {
            latitude: Number(latitude),
            longitude: Number(longitude)
          },

          soil: {

            ph: estimatedPH,

            organicCarbon_g_per_kg:
              estimatedOrganicCarbon

          }

        });

      });


    } catch (error) {

      console.error(
        "Soil analysis error:",
        error
      );

      res.status(500).json({
        success: false,
        message: "Soil analysis failed."
      });

    }

  });


  // ==========================================================
  // WEATHER INTELLIGENCE
  // Uses Open-Meteo for current weather
  // ==========================================================

  app.post("/api/weather", async (req, res) => {

    const {
      latitude,
      longitude
    } = req.body;


    console.log("Weather request:", {
      latitude,
      longitude
    });


    // Check location
    if (!latitude || !longitude) {

      return res.status(400).json({
        success: false,
        message: "Latitude and longitude are required."
      });

    }


    try {

      // Build Open-Meteo API URL
      const weatherUrl =
        `https://api.open-meteo.com/v1/forecast` +
        `?latitude=${latitude}` +
        `&longitude=${longitude}` +
        `&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m` +
        `&timezone=auto`;


      // Request current weather
      const response =
        await fetch(weatherUrl);


      // Check API response
      if (!response.ok) {

        throw new Error(
          "Weather API request failed"
        );

      }


      // Convert response to JSON
      const data =
        await response.json();


      console.log(
        "Weather data:",
        data
      );


      // Send simplified weather data
      // to the React frontend
      res.json({

        success: true,

        location: {
          latitude: Number(latitude),
          longitude: Number(longitude)
        },

        weather: {

          temperature:
            data.current.temperature_2m,

          humidity:
            data.current.relative_humidity_2m,

          precipitation:
            data.current.precipitation,

          windSpeed:
            data.current.wind_speed_10m

        }

      });


    } catch (error) {

      console.error(
        "Weather analysis failed:",
        error
      );


      res.status(500).json({

        success: false,

        message:
          "Weather data unavailable."

      });

    }

  });


  // ==========================================================
  // START SERVER
  // ==========================================================

  app.listen(PORT, () => {

    console.log(
      `AGROBRIDGE backend running on port ${PORT}`
    );

  });

}