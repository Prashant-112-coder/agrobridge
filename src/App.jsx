import { useEffect, useMemo, useState } from "react";
import "./App.css";
import heroImage from "./assets/hero.png";

const API_BASE = "https://agrobridge-backend-gjbk.onrender.com";

const initialForm = {
  farmerName: "",
  country: "India",
  state: "Karnataka",
  taluk: "Mandya",
  village: "Mandya",
  latitude: "12.5218",
  longitude: "76.8951",
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

const locationData = {
  India: {
    Karnataka: {
      "Mandya": ["Mandya", "Hosahalli", "Holalu", "Muthathi"],
      "Maddur": ["Maddur", "Besagarahalli", "Koppa", "Huliyurdurga"],
      "Malavalli": ["Malavalli", "Halagur", "Koratagere", "Kirugavalu"],
      "Krishnarajpet": ["Krishnarajpet", "Kikkeri", "Akkihebbalu", "Bookanakere"],
      "Srirangapatna": ["Srirangapatna", "Palahalli", "Belagola", "Arakere"],
      "Nagamangala": ["Nagamangala", "Bellur", "Bindahalli", "Devalapura"],
      "Pandavapura": ["Pandavapura", "Melukote", "Somanahalli", "Kyathanahalli"],
    },
    "Tamil Nadu": {
      "Coimbatore North": ["Coimbatore", "Kovilpalayam", "Saravanampatti"],
      "Madurai North": ["Madurai", "Alanganallur", "Vilangudi"],
    },
    Kerala: {
      "Alathur": ["Alathur", "Kuzhalmannam", "Kannambra"],
      "Kottayam": ["Kottayam", "Kumarakom", "Pallom"],
    },
    "Andhra Pradesh": {
      "Guntur": ["Guntur", "Ponnur", "Tenali"],
      "Tirupati": ["Tirupati", "Renigunta", "Chandragiri"],
    },
    Telangana: {
      "Hyderabad": ["Hyderabad", "Shamshabad", "Rajendranagar"],
      "Warangal": ["Warangal", "Hanamkonda", "Kazipet"],
    },
    Maharashtra: {
      "Pune": ["Pune", "Haveli", "Mulshi"],
      "Nashik": ["Nashik", "Dindori", "Sinnar"],
    },
    Goa: {
      "Tiswadi": ["Panaji", "Ribandar", "Taleigao"],
      "Salcete": ["Margao", "Navelim", "Colva"],
    },
  },
};

const countries = Object.keys(locationData);
const states = (country) => Object.keys(locationData[country] || {});
const taluks = (country, state) => Object.keys(locationData[country]?.[state] || {});
const villages = (country, state, taluk) => locationData[country]?.[state]?.[taluk] || [];

const steps = [
  { icon: "👤", title: "Farmer Information", short: "Basic details about you." },
  { icon: "📍", title: "Farm Location", short: "Country, state, taluk and village." },
  { icon: "🌱", title: "Crop Information", short: "Tell us what you are growing." },
  { icon: "🧪", title: "Soil Information", short: "Use your soil test or location estimate." },
  { icon: "🚜", title: "Farming Information", short: "Context for better recommendations." },
];

function App() {
  const [form, setForm] = useState({ ...initialForm, farmerName: "Ravi", crop: "Tomato", area: "2.5", cropAge: "35" });
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
  const [menuOpen, setMenuOpen] = useState(false);

  const locationText = useMemo(() => {
    if (!form.latitude || !form.longitude) return "Location not selected";
    return `${Number(form.latitude).toFixed(4)}° N, ${Number(form.longitude).toFixed(4)}° E`;
  }, [form.latitude, form.longitude]);

  const update = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setAnalysisDone(false);
  };

  const changeCountry = (value) => {
    const nextStates = states(value);
    const nextState = nextStates[0] || "";
    const nextTaluks = taluks(value, nextState);
    const nextTaluk = nextTaluks[0] || "";
    const nextVillages = villages(value, nextState, nextTaluk);
    setForm((current) => ({ ...current, country: value, state: nextState, taluk: nextTaluk, village: nextVillages[0] || "" }));
    setAnalysisDone(false);
  };

  const changeState = (value) => {
    const nextTaluks = taluks(form.country, value);
    const nextTaluk = nextTaluks[0] || "";
    const nextVillages = villages(form.country, value, nextTaluk);
    setForm((current) => ({ ...current, state: value, taluk: nextTaluk, village: nextVillages[0] || "" }));
    setAnalysisDone(false);
  };

  const changeTaluk = (value) => {
    const nextVillages = villages(form.country, form.state, value);
    setForm((current) => ({ ...current, taluk: value, village: nextVillages[0] || "" }));
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
        setMessage("Current farm location captured successfully. Select the matching administrative location above.");
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
    if (!res.ok || data.success === false) throw new Error(data.message || `Request failed: ${res.status}`);
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
    <div className="app-shell">
      <aside className={`sidebar ${menuOpen ? "open" : ""}`}>
        <div className="sidebar-brand">
          <div className="brand-leaf">🌿</div>
          <div><strong>AGROBRIDGE</strong><span>Smart Farm Intelligence</span></div>
        </div>

        <nav className="sidebar-nav" aria-label="Main navigation">
          <a className="nav-item active" href="#farm-form" onClick={() => setMenuOpen(false)}><span>🏠</span> Dashboard</a>
          <a className="nav-item" href="#farm-summary" onClick={() => setMenuOpen(false)}><span>🌾</span> My Farms</a>
          <a className="nav-item" href="#analytics" onClick={() => setMenuOpen(false)}><span>🕘</span> History</a>
          <a className="nav-item" href="#agroguide" onClick={() => setMenuOpen(false)}><span>🗺️</span> AgroGuide</a>
          <a className="nav-item" href="#settings" onClick={(e) => { e.preventDefault(); setMessage("Settings will be available in the next module."); setMenuOpen(false); }}><span>⚙️</span> Settings</a>
        </nav>

        <div className="sidebar-visual">
          <img src={heroImage} alt="Green agricultural fields" />
          <div className="sidebar-visual-overlay">
            <span>🌱</span>
            <strong>Empowering Farmers<br />with AI &amp; Satellite Intelligence</strong>
          </div>
        </div>

        <div className="safe-card">
          <span className="safe-icon">🛡️</span>
          <div><strong>Your Data is Safe</strong><small>We use your information only to provide personalized farm insights.</small></div>
        </div>

        <div className="sidebar-footer">
          <div><span>🌿</span><strong>AGROBRIDGE AI</strong></div>
          <p>Building a sustainable future for agriculture.</p>
          <small>© 2024 AGROBRIDGE AI <span>♡</span></small>
        </div>
      </aside>

      <div className="page-area">
        <header className="topbar">
          <button className="menu-button" type="button" aria-label="Open navigation" onClick={() => setMenuOpen((open) => !open)}>☰</button>
          <nav className="top-links">
            <a href="#farm-form">⌂ <span>Dashboard</span></a>
            <a href="#farm-summary">♧ <span>My Farms</span></a>
            <a href="#analytics">◷ <span>History</span></a>
            <a href="#agroguide">▧ <span>AgroGuide</span></a>
          </nav>
          <div className="profile-area">
            <button className="notification-button" type="button" onClick={() => setMessage("You are all caught up. No new alerts.")} aria-label="Notifications">🔔<i /></button>
            <div className="avatar">👨‍🌾</div>
            <div className="profile-copy"><span>Welcome,</span><strong>Farmer</strong></div>
            <span className="profile-arrow">⌄</span>
          </div>
        </header>

        <main className="main-content">
          <section className="farm-header">
            <div>
              <div className="title-row"><span className="title-icon">🌿</span><h1>Farm Information</h1></div>
              <p>Fill in the details below to get started</p>
            </div>
            <div className="farm-banner-art" aria-hidden="true"><span>🦋</span><span>🌳</span><span>🏡</span><span>🌳</span><span>🚜</span></div>
          </section>

          <section className="farm-workspace" id="farm-form">
            <div className="step-rail" aria-label="Farm information steps">
              {steps.map((step, index) => {
                const completed = analysisDone || (index === 0 && form.farmerName) || (index === 1 && form.country && form.state && form.taluk && form.village) || (index === 2 && form.crop) || (index === 3 && form.soilSource) || (index === 4 && (form.irrigation || form.cropStage));
                return (
                  <div className={`step-item ${completed ? "completed" : ""}`} key={step.title}>
                    <div className="step-number">{completed ? "✓" : index + 1}</div>
                    {index < steps.length - 1 && <div className="step-line" />}
                    <div className="step-icon">{step.icon}</div>
                    <div className="step-copy"><strong>{step.title}</strong><small>{step.short}</small></div>
                  </div>
                );
              })}
            </div>

            <section className="farm-form-card">
              <div className="form-card-head">
                <div><span className="mini-label">FARM INFORMATION</span><h2>Tell us about your farm</h2><p>Fill in the details below to get started.</p></div>
                <span className="steps-pill">5 STEPS</span>
              </div>

              <div className="form-block">
                <div className="block-label"><span>1</span><div><strong>Farmer Information</strong><small>Basic details about the farmer.</small></div></div>
                <div className="fields one"><Field label="Farmer Name" icon="👤"><input value={form.farmerName} onChange={(e) => update("farmerName", e.target.value)} placeholder="Enter your full name" /></Field></div>
              </div>

              <div className="form-block">
                <div className="block-label"><span>2</span><div><strong>Farm Location</strong><small>Select your administrative location and provide coordinates for satellite and weather analysis.</small></div></div>
                <div className="fields location-fields">
                  <div className="location-selects">
                    <Field label="Country" icon="🌍"><select value={form.country} onChange={(e) => changeCountry(e.target.value)}><option value="">Select country</option>{countries.map((country) => <option key={country} value={country}>{country}</option>)}</select></Field>
                    <Field label="State" icon="🏛️"><select value={form.state} onChange={(e) => changeState(e.target.value)} disabled={!form.country}><option value="">Select state</option>{states(form.country).map((state) => <option key={state} value={state}>{state}</option>)}</select></Field>
                    <Field label="Taluk / Tehsil" icon="📌"><select value={form.taluk} onChange={(e) => changeTaluk(e.target.value)} disabled={!form.state}><option value="">Select taluk</option>{taluks(form.country, form.state).map((taluk) => <option key={taluk} value={taluk}>{taluk}</option>)}</select></Field>
                    <Field label="Village / Locality" icon="🏘️"><select value={form.village} onChange={(e) => update("village", e.target.value)} disabled={!form.taluk}><option value="">Select village</option>{villages(form.country, form.state, form.taluk).map((village) => <option key={village} value={village}>{village}</option>)}</select></Field>
                  </div>
                  <div className="location-row"><button type="button" className="location-button" onClick={useCurrentLocation} disabled={locationLoading}>{locationLoading ? "⌛ Locating..." : "📍 Use My Current Location"}</button><span className="location-readout">{locationText}</span></div>
                  <Field label="Latitude" icon="⌖"><input type="number" step="any" value={form.latitude} onChange={(e) => update("latitude", e.target.value)} placeholder="e.g. 12.5218" /></Field>
                  <Field label="Longitude" icon="🧭"><input type="number" step="any" value={form.longitude} onChange={(e) => update("longitude", e.target.value)} placeholder="e.g. 76.8951" /></Field>
                  <small className="helper-text">Administrative location helps identify the farm area. Latitude and longitude remain the coordinates used for satellite and weather analysis.</small>
                </div>
              </div>

              <div className="form-block">
                <div className="block-label"><span>3</span><div><strong>Crop Information</strong><small>Tell us about the crop currently growing.</small></div></div>
                <div className="fields three">
                  <Field label="Crop" icon="🌾"><select value={form.crop} onChange={(e) => update("crop", e.target.value)}><option value="">Select crop</option>{crops.map((crop) => <option key={crop}>{crop}</option>)}</select></Field>
                  <Field label="Farm Area (acres)" icon="📐"><input type="number" min="0" step="0.1" value={form.area} onChange={(e) => update("area", e.target.value)} placeholder="e.g. 2.5" /></Field>
                  <Field label="Crop Age (days)" icon="📅"><input type="number" min="0" value={form.cropAge} onChange={(e) => update("cropAge", e.target.value)} placeholder="e.g. 35" /></Field>
                </div>
              </div>

              <div className="form-block">
                <div className="block-label"><span>4</span><div><strong>Soil Information</strong><small>Provide a soil test report if you have one.</small></div></div>
                <div className="fields soil-area">
                  <div className="soil-choice-title">Do you have a soil test report?</div>
                  <div className="choice-row">
                    <button type="button" className={`soil-choice ${form.soilSource === "test" ? "selected" : ""}`} onClick={() => update("soilSource", "test")}><span>◉</span> Yes, I have a soil test report</button>
                    <button type="button" className={`soil-choice ${form.soilSource === "none" ? "selected" : ""}`} onClick={() => update("soilSource", "none")}><span>◯</span> No, use location-based soil data</button>
                  </div>
                  {form.soilSource === "test" ? (
                    <div className="fields three soil-test-fields">
                      <Field label="Soil pH" icon="🧪"><input type="number" step="0.1" min="0" max="14" value={form.soilPH} onChange={(e) => update("soilPH", e.target.value)} placeholder="e.g. 6.5" /></Field>
                      <Field label="Nitrogen (N)" icon="🧪"><input value={form.nitrogen} onChange={(e) => update("nitrogen", e.target.value)} placeholder="e.g. Medium" /></Field>
                      <Field label="Phosphorus (P)" icon="🧪"><input value={form.phosphorus} onChange={(e) => update("phosphorus", e.target.value)} placeholder="e.g. High" /></Field>
                      <Field label="Potassium (K)" icon="🧪"><input value={form.potassium} onChange={(e) => update("potassium", e.target.value)} placeholder="e.g. Medium" /></Field>
                      <Field label="Organic Carbon (%)" icon="🧬"><input type="number" step="0.1" value={form.organicCarbon} onChange={(e) => update("organicCarbon", e.target.value)} placeholder="e.g. 0.8" /></Field>
                      <Field label="Soil Type" icon="🌱"><select value={form.soilType} onChange={(e) => update("soilType", e.target.value)}><option value="">Select soil type</option>{soilTypes.map((soil) => <option key={soil}>{soil}</option>)}</select></Field>
                    </div>
                  ) : <div className="info-strip">ⓘ <span>If you don't have a soil test report, we will use available location-based soil information.</span></div>}
                </div>
              </div>

              <div className="form-block last">
                <div className="block-label"><span>5</span><div><strong>Farming Information</strong><small>Additional information for better recommendations.</small></div></div>
                <div className="fields two">
                  <Field label="Irrigation Method" icon="💧"><select value={form.irrigation} onChange={(e) => update("irrigation", e.target.value)}><option value="">Select method</option><option>Drip</option><option>Sprinkler</option><option>Flood</option><option>Rainfed</option><option>Other</option></select></Field>
                  <Field label="Previous Crop" icon="🌾"><select value={form.previousCrop} onChange={(e) => update("previousCrop", e.target.value)}><option value="">Select crop</option>{crops.map((crop) => <option key={crop}>{crop}</option>)}</select></Field>
                  <Field label="Planting Date" icon="📅"><input type="date" value={form.plantingDate} onChange={(e) => update("plantingDate", e.target.value)} /></Field>
                  <Field label="Current Crop Stage" icon="🌿"><select value={form.cropStage} onChange={(e) => update("cropStage", e.target.value)}><option value="">Select stage</option>{cropStages.map((stage) => <option key={stage}>{stage}</option>)}</select></Field>
                </div>
              </div>
            </section>
          </section>

          <section className="analyze-panel">
            <div className="why-copy"><div className="why-icon">🤖</div><div><strong>Why do we need this information?</strong><p>We combine satellite data, soil intelligence and weather data to provide accurate farm insights and smart recommendations.</p></div></div>
            <button type="button" className={`analyze-cta ${analyzing ? "is-analyzing" : ""} ${analysisDone ? "is-done" : ""}`} onClick={analyzeFarm} disabled={analyzing}>
              <span className="cta-edge" />
              <span className="cta-inner"><span>{analyzing ? "⟳" : analysisDone ? "✓" : "🌿"}</span><strong>{analyzing ? "Analyzing Your Farm..." : analysisDone ? "Analysis Complete" : "Analyze My Farm"}</strong><b>→</b></span>
            </button>
            <div className="secure-note">🛡️ Your information is protected and secure</div>
          </section>

          {message && <div className={`notice ${analysisDone ? "success" : ""}`}>{analysisDone ? "✓" : "•"} {message}</div>}

          <section className="data-section" id="analytics">
            <div className="section-title"><div><span>FIELD ANALYTICS</span><h2>Farm Health</h2></div><em>{analyzing ? "ANALYZING" : analysisDone ? "LIVE ANALYSIS" : "AWAITING INPUT"}</em></div>
            <div className="metrics"><Metric icon="❤️" label="FARM HEALTH" value={farmHealth?.score ?? "--"} suffix="/ 100" status={farmHealth?.status || "ANALYZING"} /><Metric icon="🛰️" label="NDVI" value={farmHealth ? farmHealth.ndvi.toFixed(2) : "--"} status="SATELLITE" /><Metric icon="🧪" label="SOIL pH" value={farmHealth?.soilPH ?? "--"} status="SOIL DATA" /><Metric icon="🌡️" label="TEMPERATURE" value={farmHealth?.temperature ?? "--"} suffix="°C" status="WEATHER" /></div>
          </section>

          <section className="result-grid" id="farm-summary">
            <div className="result-card farm-summary-card"><div className="card-head"><span>ACTIVE FARM</span><b>01</b></div><h2>{form.farmerName ? `${form.farmerName}'s Farm` : "Your Farm"}</h2><p>📍 {locationText}</p><div className="farm-detail-row"><div><small>CROP</small><strong>{form.crop || "—"}</strong></div><div><small>AREA</small><strong>{form.area ? `${form.area} acres` : "—"}</strong></div><div><small>CROP AGE</small><strong>{form.cropAge ? `${form.cropAge} days` : "—"}</strong></div></div></div>
            <div className="result-card satellite-card"><div className="card-head"><span>SATELLITE INTELLIGENCE</span><b>{analysisDone ? "LIVE" : "READY"}</b></div><div className="satellite-map"><div className="map-lines" /><span className="map-sun">☀️</span><span className="farm-pin">●</span><span className="map-location">{locationText}</span><small>SENTINEL-2 • NDVI</small></div></div>
          </section>

          <section className="data-section">
            <div className="section-title"><div><span>SOIL INTELLIGENCE</span><h2>Soil conditions</h2></div><em>{soilLoading ? "UPDATING" : soilResult ? "AVAILABLE" : "READY"}</em></div>
            <div className="metrics"><Metric icon="🧪" label="SOIL pH" value={soilResult?.soil?.ph ?? "--"} status={form.soilSource === "test" ? "FARMER TEST" : "LOCATION ESTIMATE"} /><Metric icon="🌱" label="ORGANIC CARBON" value={soilResult?.soil?.organicCarbon_g_per_kg ? Number(soilResult.soil.organicCarbon_g_per_kg).toFixed(1) : "--"} suffix=" g/kg" status="SOIL DATA" /><div className="metric-card wide"><span>DATA SOURCE</span><strong>{soilResult?.source?.dataset || (form.soilSource === "test" ? "Farmer soil test" : "OpenLandMap")}</strong><small>{soilLoading ? "FETCHING" : "READY"}</small></div></div>
          </section>

          <section className="data-section">
            <div className="section-title"><div><span>WEATHER INTELLIGENCE</span><h2>Current farm weather</h2></div><em>{weatherLoading ? "UPDATING" : weatherData ? "LIVE" : "READY"}</em></div>
            <div className="metrics"><Metric icon="🌡️" label="TEMPERATURE" value={weatherData?.weather?.temperature ?? "--"} suffix="°C" status="CURRENT" /><Metric icon="💧" label="HUMIDITY" value={weatherData?.weather?.humidity ?? "--"} suffix="%" status="CURRENT" /><Metric icon="🌧️" label="PRECIPITATION" value={weatherData?.weather?.precipitation ?? "--"} suffix=" mm" status="CURRENT" /><Metric icon="💨" label="WIND SPEED" value={weatherData?.weather?.windSpeed ?? "--"} suffix=" km/h" status="CURRENT" /></div>
          </section>

          <section className="ai-card" id="agroguide">
            <div className="ai-icon">🤖</div><div className="ai-copy"><span>AGROGUIDE AI</span><h2>Farm Intelligence</h2><p>{analysisDone ? "Your farm signals have been combined into a single health view. Recommendations can build on these results next." : "Analyze your farm to combine satellite imagery, soil information and current weather conditions."}</p><button type="button" onClick={() => setMessage(analysisDone ? "Recommendation engine is the next module to connect." : "Run Analyze My Farm first to unlock farm intelligence.")}>View Recommendations →</button></div><div className="ai-score"><span>FARM HEALTH</span><strong>{farmHealth?.score ?? "--"}</strong><small>/100</small></div>
          </section>

          {response && <details className="response-card"><summary>Technical response</summary><pre>{JSON.stringify(response, null, 2)}</pre></details>}
        </main>

        <footer className="app-footer"><span>🌿 AGROBRIDGE AI</span><span>CLIMATE-RESILIENT AGRICULTURE</span></footer>
      </div>
    </div>
  );
}

function Field({ label, icon, children }) {
  return <label className="field"><span>{label}</span><div className="input-wrap"><i>{icon}</i>{children}</div></label>;
}

function Metric({ icon, label, value, suffix = "", status }) {
  return <div className="metric-card"><span className="metric-icon">{icon}</span><span className="metric-label">{label}</span><div className="metric-value"><strong>{value}</strong>{suffix && <small>{suffix}</small>}</div><span className="metric-status">{status}</span></div>;
}

export default App;
