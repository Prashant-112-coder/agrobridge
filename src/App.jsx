import { useEffect, useMemo, useState } from "react";
import "./App.css";

const API_BASE = "https://agrobridge-backend-gjbk.onrender.com";

const initialForm = {
  farmerName: "",
  latitude: "",
  longitude: "",
  crop: "",
  area: "",
  cropAge: "",
  irrigation: "",
  previousCrop: "",
  plantingDate: "",
  cropStage: "",
  soilSource: "none",
  soilPH: "",
  nitrogen: "",
  phosphorus: "",
  potassium: "",
  organicCarbon: "",
  soilType: "",
};

const crops = ["Tomato", "Rice", "Wheat", "Maize", "Sugarcane", "Cotton", "Ragi", "Other"];
const soilTypes = ["Black Soil", "Red Soil", "Alluvial Soil", "Sandy Soil", "Clay Soil", "Loamy Soil", "Other"];
const cropStages = ["Seedling", "Vegetative", "Flowering", "Fruiting", "Maturity"];

function App() {
  const [form, setForm] = useState({ ...initialForm, farmerName: "Ravi", latitude: "12.5218", longitude: "76.8951", crop: "Tomato", area: "2.5", cropAge: "35" });
  const [response, setResponse] = useState(null);
  const [soilResult, setSoilResult] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [farmHealth, setFarmHealth] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [soilLoading, setSoilLoading] = useState(false);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [analysisDone, setAnalysisDone] = useState(false);

  const locationText = useMemo(() => {
    if (!form.latitude || !form.longitude) return "Location not selected";
    return `${Number(form.latitude).toFixed(4)}° N, ${Number(form.longitude).toFixed(4)}° E`;
  }, [form.latitude, form.longitude]);

  const update = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setAnalysisDone(false);
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setMessage("Geolocation is not supported by this browser. Enter coordinates manually.");
      return;
    }

    setLocationLoading(true);
    setMessage("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        update("latitude", position.coords.latitude.toFixed(6));
        update("longitude", position.coords.longitude.toFixed(6));
        setLocationLoading(false);
        setMessage("Current farm location captured successfully.");
      },
      () => {
        setLocationLoading(false);
        setMessage("Location permission was not available. You can enter latitude and longitude manually.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const postJSON = async (path, body) => {
    const res = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok || data.success === false) {
      throw new Error(data.message || `Request failed: ${res.status}`);
    }
    return data;
  };

  const getSoil = async (latitude, longitude) => {
    setSoilLoading(true);
    try {
      const data = await postJSON("/api/soil", { latitude, longitude });
      setSoilResult(data);
      return data;
    } finally {
      setSoilLoading(false);
    }
  };

  const getWeather = async (latitude, longitude) => {
    setWeatherLoading(true);
    try {
      const data = await postJSON("/api/weather", { latitude, longitude });
      setWeatherData(data);
      return data;
    } finally {
      setWeatherLoading(false);
    }
  };

  const calculateFarmHealth = (farmData, soilData, weather) => {
    const ndvi = Number(farmData?.satellite?.ndvi);
    const ph = Number(soilData?.soil?.ph);
    const temperature = Number(weather?.weather?.temperature);

    if (![ndvi, ph, temperature].every(Number.isFinite)) return;

    let ndviScore = 20;
    if (ndvi >= 0.6) ndviScore = 100;
    else if (ndvi >= 0.4) ndviScore = 80;
    else if (ndvi >= 0.2) ndviScore = 60;
    else if (ndvi >= 0.1) ndviScore = 40;

    let soilScore = 50;
    if (ph >= 6 && ph <= 7.5) soilScore = 100;
    else if (ph >= 5.5 && ph <= 8) soilScore = 75;

    let weatherScore = 100;
    if (temperature > 35) weatherScore = 40;
    else if (temperature > 32) weatherScore = 60;
    else if (temperature > 30) weatherScore = 80;

    const score = Math.round(ndviScore * 0.5 + soilScore * 0.3 + weatherScore * 0.2);
    const status = score < 50 ? "HIGH RISK" : score < 70 ? "MODERATE" : "GOOD";

    setFarmHealth({ score, status, ndvi, soilPH: ph, temperature });
  };

  const analyzeFarm = async () => {
    const latitude = Number(form.latitude);
    const longitude = Number(form.longitude);

    if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
      setMessage("Please enter a valid latitude between -90 and 90.");
      return;
    }
    if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
      setMessage("Please enter a valid longitude between -180 and 180.");
      return;
    }
    if (!form.crop) {
      setMessage("Please select the crop you are currently growing.");
      return;
    }

    setAnalyzing(true);
    setAnalysisDone(false);
    setMessage("Analyzing your farm using satellite, soil and weather intelligence...");
    setResponse(null);
    setFarmHealth(null);

    try {
      const [farmData, weather] = await Promise.all([
        postJSON("/api/farm", { latitude, longitude, crop: form.crop }),
        getWeather(latitude, longitude),
      ]);

      setResponse(farmData);

      let soilData;
      if (form.soilSource === "test" && form.soilPH !== "") {
        soilData = {
          success: true,
          source: { type: "farmer_soil_test" },
          soil: { ph: Number(form.soilPH), organicCarbon_g_per_kg: form.organicCarbon ? Number(form.organicCarbon) * 10 : null },
        };
        setSoilResult(soilData);
      } else {
        soilData = await getSoil(latitude, longitude);
      }

      calculateFarmHealth(farmData, soilData, weather);
      setAnalysisDone(true);
      setMessage("Analysis complete. Your latest farm intelligence is ready below.");
    } catch (error) {
      console.error("AGROBRIDGE analysis failed:", error);
      setMessage(`Analysis could not be completed: ${error.message}`);
    } finally {
      setAnalyzing(false);
    }
  };

  useEffect(() => {
    document.title = "AGROBRIDGE AI | Smart Farm Intelligence";
  }, []);

  return (
    <div className="app">
      <header className="navbar">
        <div className="brand">
          <div className="brand-mark">A</div>
          <div>
            <div className="brand-name">AGROBRIDGE</div>
            <div className="brand-subtitle">SMART FARM INTELLIGENCE</div>
          </div>
        </div>
        <div className="nav-right">
          <span className="status-dot" />
          <span>SYSTEM ONLINE</span>
        </div>
      </header>

      <main className="dashboard">
        <section className="hero-section">
          <div>
            <p className="eyebrow">SMART AGRICULTURE PLATFORM</p>
            <h1>Understand your <span>farm.</span></h1>
            <p className="hero-description">
              Give AGROBRIDGE your farm details and receive a data-driven view of crop health,
              soil conditions and current weather.
            </p>
          </div>

          <button
            type="button"
            className={`analyze-button ${analyzing ? "is-analyzing" : ""} ${analysisDone ? "is-done" : ""}`}
            onClick={analyzeFarm}
            disabled={analyzing}
          >
            <span className="button-glow" />
            <span className="button-content">
              <span className="button-icon">{analyzing ? "◌" : analysisDone ? "✓" : "✦"}</span>
              {analyzing ? "Analyzing Your Farm..." : analysisDone ? "Analysis Complete" : "Analyze My Farm"}
              <span className="button-arrow">→</span>
            </span>
          </button>
        </section>

        <section className="input-layout">
          <aside className="form-aside">
            <div className="aside-image">
              <div className="field-lines" />
              <div className="sun" />
              <div className="hills" />
            </div>
            <div className="aside-copy">
              <p className="eyebrow">YOUR FARM DIGITAL PROFILE</p>
              <h2>Let's analyze<br /><span>your farm.</span></h2>
              <p>Accurate inputs help us combine satellite imagery, soil intelligence and weather data for useful farm insights.</p>
            </div>
            <div className="safe-card">
              <span>✓</span>
              <div><strong>Your data is safe</strong><small>Used only to provide your farm analysis.</small></div>
            </div>
          </aside>

          <section className="farm-form-card">
            <div className="form-heading">
              <div>
                <p className="eyebrow">FARM INFORMATION</p>
                <h2>Tell us about your farm</h2>
                <p>Fill in the details below to get started.</p>
              </div>
              <span className="step-label">5 STEPS</span>
            </div>

            <div className="form-section">
              <div className="section-marker"><span>1</span><div><strong>Farmer Information</strong><small>Basic details about you.</small></div></div>
              <div className="form-fields single">
                <label>Farmer Name<input value={form.farmerName} onChange={(e) => update("farmerName", e.target.value)} placeholder="Enter your full name" /></label>
              </div>
            </div>

            <div className="form-section">
              <div className="section-marker"><span>2</span><div><strong>Farm Location</strong><small>Used for satellite and weather analysis.</small></div></div>
              <div className="form-fields">
                <div className="location-action"><button type="button" className="outline-button" onClick={useCurrentLocation} disabled={locationLoading}>{locationLoading ? "Locating..." : "⌖ Use My Current Location"}</button><small>{locationText}</small></div>
                <label>Latitude<input type="number" step="any" value={form.latitude} onChange={(e) => update("latitude", e.target.value)} placeholder="e.g. 12.5218" /></label>
                <label>Longitude<input type="number" step="any" value={form.longitude} onChange={(e) => update("longitude", e.target.value)} placeholder="e.g. 76.8951" /></label>
              </div>
            </div>

            <div className="form-section">
              <div className="section-marker"><span>3</span><div><strong>Crop Information</strong><small>Tell us what you are growing.</small></div></div>
              <div className="form-fields three">
                <label>Crop<select value={form.crop} onChange={(e) => update("crop", e.target.value)}><option value="">Select crop</option>{crops.map((crop) => <option key={crop}>{crop}</option>)}</select></label>
                <label>Farm Area (acres)<input type="number" min="0" step="0.1" value={form.area} onChange={(e) => update("area", e.target.value)} placeholder="e.g. 2.5" /></label>
                <label>Crop Age (days)<input type="number" min="0" value={form.cropAge} onChange={(e) => update("cropAge", e.target.value)} placeholder="e.g. 35" /></label>
              </div>
            </div>

            <div className="form-section">
              <div className="section-marker"><span>4</span><div><strong>Soil Information</strong><small>Use your soil test or our location estimate.</small></div></div>
              <div className="soil-choice-grid">
                <button type="button" className={`choice-card ${form.soilSource === "test" ? "selected" : ""}`} onClick={() => update("soilSource", "test")}><span>◉</span><div><strong>I have a soil test</strong><small>Enter your laboratory results.</small></div></button>
                <button type="button" className={`choice-card ${form.soilSource === "none" ? "selected" : ""}`} onClick={() => update("soilSource", "none")}><span>◎</span><div><strong>No soil test</strong><small>Use location-based soil data.</small></div></button>
              </div>
              {form.soilSource === "test" && (
                <div className="form-fields three soil-test-fields">
                  <label>Soil pH<input type="number" step="0.1" min="0" max="14" value={form.soilPH} onChange={(e) => update("soilPH", e.target.value)} placeholder="e.g. 6.5" /></label>
                  <label>Nitrogen<input value={form.nitrogen} onChange={(e) => update("nitrogen", e.target.value)} placeholder="e.g. Medium" /></label>
                  <label>Phosphorus<input value={form.phosphorus} onChange={(e) => update("phosphorus", e.target.value)} placeholder="e.g. High" /></label>
                  <label>Potassium<input value={form.potassium} onChange={(e) => update("potassium", e.target.value)} placeholder="e.g. Medium" /></label>
                  <label>Organic Carbon (%)<input type="number" step="0.1" value={form.organicCarbon} onChange={(e) => update("organicCarbon", e.target.value)} placeholder="e.g. 0.8" /></label>
                  <label>Soil Type<select value={form.soilType} onChange={(e) => update("soilType", e.target.value)}><option value="">Select soil type</option>{soilTypes.map((soil) => <option key={soil}>{soil}</option>)}</select></label>
                </div>
              )}
              {form.soilSource === "none" && <div className="info-strip">✦ If you don't have a soil report, AGROBRIDGE will use available location-based soil information.</div>}
            </div>

            <div className="form-section last">
              <div className="section-marker"><span>5</span><div><strong>Farming Information</strong><small>Optional context for better recommendations.</small></div></div>
              <div className="form-fields two">
                <label>Irrigation Method<select value={form.irrigation} onChange={(e) => update("irrigation", e.target.value)}><option value="">Select method</option><option>Drip</option><option>Sprinkler</option><option>Flood</option><option>Rainfed</option><option>Other</option></select></label>
                <label>Previous Crop<select value={form.previousCrop} onChange={(e) => update("previousCrop", e.target.value)}><option value="">Select crop</option>{crops.map((crop) => <option key={crop}>{crop}</option>)}</select></label>
                <label>Planting Date<input type="date" value={form.plantingDate} onChange={(e) => update("plantingDate", e.target.value)} /></label>
                <label>Current Crop Stage<select value={form.cropStage} onChange={(e) => update("cropStage", e.target.value)}><option value="">Select stage</option>{cropStages.map((stage) => <option key={stage}>{stage}</option>)}</select></label>
              </div>
            </div>

            <div className="form-submit-row">
              <div><strong>Ready to analyze?</strong><small>We combine satellite, soil and weather signals.</small></div>
              <button type="button" className="mobile-analyze" onClick={analyzeFarm} disabled={analyzing}>{analyzing ? "Analyzing..." : "Analyze My Farm →"}</button>
            </div>
          </section>
        </section>

        {message && <div className={`notice ${analysisDone ? "success" : ""}`}>{analysisDone ? "✓" : "•"} {message}</div>}

        <section className="section">
          <div className="section-title"><div><p className="eyebrow">FIELD ANALYTICS</p><h2>Farm Health</h2></div><span className="timestamp">{analyzing ? "ANALYZING" : analysisDone ? "LIVE ANALYSIS" : "AWAITING INPUT"}</span></div>
          <div className="metrics">
            <Metric label="FARM HEALTH" value={farmHealth?.score ?? "--"} suffix="/ 100" status={farmHealth?.status || "ANALYZING"} />
            <Metric label="NDVI" value={farmHealth ? farmHealth.ndvi.toFixed(2) : "--"} status="SATELLITE" />
            <Metric label="SOIL pH" value={farmHealth?.soilPH ?? "--"} status="SOIL DATA" />
            <Metric label="TEMPERATURE" value={farmHealth?.temperature ?? "--"} suffix="°C" status="WEATHER" />
          </div>
        </section>

        <section className="farm-grid">
          <div className="card farm-summary-card">
            <div className="card-header"><span>ACTIVE FARM</span><span className="card-number">01</span></div>
            <div className="farm-location"><h2>{form.farmerName ? `${form.farmerName}'s Farm` : "Your Farm"}</h2><p>Location: {locationText}</p></div>
            <div className="farm-details"><div><span>CROP</span><strong>{form.crop || "—"}</strong></div><div><span>AREA</span><strong>{form.area ? `${form.area} acres` : "—"}</strong></div><div><span>CROP AGE</span><strong>{form.cropAge ? `${form.cropAge} days` : "—"}</strong></div></div>
          </div>
          <div className="card satellite-card"><div className="card-header"><span>SATELLITE INTELLIGENCE</span><span className="live-label">{analysisDone ? "LIVE" : "READY"}</span></div><div className="satellite-placeholder"><div className="map-grid" /><div className="farm-point"><span /></div><div className="map-label">{locationText}</div><div className="map-overlay">SENTINEL-2 • NDVI</div></div></div>
        </section>

        <section className="section">
          <div className="section-title"><div><p className="eyebrow">SOIL INTELLIGENCE</p><h2>Soil conditions</h2></div><span className="timestamp">{soilLoading ? "UPDATING" : soilResult ? "AVAILABLE" : "READY"}</span></div>
          <div className="metrics soil-metrics"><Metric label="SOIL pH" value={soilResult?.soil?.ph ?? "--"} status={form.soilSource === "test" ? "FARMER TEST" : "LOCATION ESTIMATE"} /><Metric label="ORGANIC CARBON" value={soilResult?.soil?.organicCarbon_g_per_kg ? Number(soilResult.soil.organicCarbon_g_per_kg).toFixed(1) : "--"} suffix=" g/kg" status="SOIL DATA" /><div className="metric-card wide-metric"><span className="metric-label">DATA SOURCE</span><strong className="source-value">{soilResult?.source?.dataset || (form.soilSource === "test" ? "Farmer soil test" : "OpenLandMap")}</strong><div className="metric-status good">{soilLoading ? "FETCHING" : "READY"}</div></div></div>
        </section>

        <section className="section">
          <div className="section-title"><div><p className="eyebrow">WEATHER INTELLIGENCE</p><h2>Current farm weather</h2></div><span className="timestamp">{weatherLoading ? "UPDATING" : weatherData ? "LIVE" : "READY"}</span></div>
          <div className="metrics"><Metric label="TEMPERATURE" value={weatherData?.weather?.temperature ?? "--"} suffix="°C" status="CURRENT" /><Metric label="HUMIDITY" value={weatherData?.weather?.humidity ?? "--"} suffix="%" status="CURRENT" /><Metric label="PRECIPITATION" value={weatherData?.weather?.precipitation ?? "--"} suffix=" mm" status="CURRENT" /><Metric label="WIND SPEED" value={weatherData?.weather?.windSpeed ?? "--"} suffix=" km/h" status="CURRENT" /></div>
        </section>

        <section className="ai-card">
          <div className="ai-icon">✦</div>
          <div className="ai-content"><p className="eyebrow">AGROGUIDE AI</p><h2>Farm Intelligence</h2><p>{analysisDone ? "Your farm signals have been combined into a single health view. Recommendations can build on these results next." : "Analyze your farm to combine satellite imagery, soil information and current weather conditions."}</p><button type="button" className="text-button" onClick={() => setMessage(analysisDone ? "Recommendation engine is the next module to connect." : "Run Analyze My Farm first to unlock farm intelligence.")}>View Recommendations →</button></div>
          <div className="ai-score"><span>FARM HEALTH</span><strong>{farmHealth?.score ?? "--"}</strong><small>/100</small></div>
        </section>

        {response && <details className="response-card"><summary>Technical response</summary><pre>{JSON.stringify(response, null, 2)}</pre></details>}
      </main>

      <footer><span>AGROBRIDGE AI</span><span>CLIMATE-RESILIENT AGRICULTURE</span></footer>
    </div>
  );
}

function Metric({ label, value, suffix = "", status }) {
  return <div className="metric-card"><span className="metric-label">{label}</span><strong>{value}</strong>{suffix && <small>{suffix}</small>}<div className="metric-status good">{status}</div></div>;
}

export default App;
