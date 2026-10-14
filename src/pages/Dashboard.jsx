import { Link } from "react-router-dom";
import { useFarm } from "../context/FarmContext";
import "./Dashboard.css";

export default function Dashboard() {
  const {
    form,
    farmHealth,
    soilResult,
    weatherData,
    locationText,
    analyzing,
    analyzeFarm
  } = useFarm();

  const farmerName = form.farmerName || "Farmer";
  const crop = form.crop || "Tomato";
  const area = form.area ? `${form.area} Acres` : "2.5 Acres";
  const taluk = form.taluk || "Mandya";
  const state = form.state || "Karnataka";
  const village = form.village || taluk;

  const healthScore = farmHealth?.score ?? 82;
  const healthStatus = farmHealth?.status || "GOOD";
  const ndvi = farmHealth?.ndvi ? farmHealth.ndvi.toFixed(2) : "0.62";
  const soilPH = farmHealth?.soilPH ?? soilResult?.soil?.ph ?? "6.8";
  const temp = weatherData?.weather?.temperature ?? 28;
  const humidity = weatherData?.weather?.humidity ?? 64;
  const wind = weatherData?.weather?.windSpeed ?? 11;
  const rain = weatherData?.weather?.precipitation ?? 0;

  const isSpraySafe = rain === 0 && wind < 15;

  const mapEmbedUrl = form.latitude && form.longitude
    ? `https://www.google.com/maps?q=${encodeURIComponent(`${form.latitude},${form.longitude}`)}&z=14&output=embed`
    : "";

  return (
    <div className="dash-container">
      {/* ── HERO BANNER ── */}
      <section className="dash-hero-card">
        <div className="hero-content">
          <div className="hero-welcome-badge">
            <span>🌱</span>
            <span>Active Farm Intelligence</span>
          </div>
          <h2>Welcome back, {farmerName}</h2>
          <p>
            Field monitoring active for <strong>{village}, {taluk}</strong> ({state}) • <strong>{crop} ({area})</strong>
          </p>
        </div>
        <div className="hero-actions">
          <button
            type="button"
            className="hero-btn-primary"
            onClick={analyzeFarm}
            disabled={analyzing}
          >
            <span>{analyzing ? "⟳" : "🛰️"}</span>
            <span>{analyzing ? "Syncing Satellites..." : "Re-Analyze Satellite"}</span>
          </button>
          <Link to="/diagnostics" className="hero-btn-secondary">
            <span>⚙️</span>
            <span>Farm Settings</span>
          </Link>
        </div>
      </section>

      {/* ── 4 KPI CARDS ── */}
      <section className="dash-kpi-grid">
        {/* Card 1: Health Score */}
        <div className="kpi-card health">
          <div className="kpi-header">
            <div className="kpi-icon-wrap">❤️</div>
            <span className="kpi-tag">{healthStatus}</span>
          </div>
          <span className="kpi-title">Farm Health Index</span>
          <div className="kpi-value-row">
            <span className="kpi-main-val">{healthScore}</span>
            <span className="kpi-unit">/ 100</span>
          </div>
          <span className="kpi-subtext">Composite index: NDVI (50%), Soil (30%), Climate (20%)</span>
        </div>

        {/* Card 2: Satellite NDVI */}
        <div className="kpi-card satellite">
          <div className="kpi-header">
            <div className="kpi-icon-wrap">🛰️</div>
            <span className="kpi-tag">Sentinel-2</span>
          </div>
          <span className="kpi-title">Vegetation Canopy (NDVI)</span>
          <div className="kpi-value-row">
            <span className="kpi-main-val">{ndvi}</span>
            <span className="kpi-unit">{Number(ndvi) >= 0.5 ? "Dense" : "Moderate"}</span>
          </div>
          <span className="kpi-subtext">10m multispectral resolution • Healthy photosynthetic activity</span>
        </div>

        {/* Card 3: Soil Quality */}
        <div className="kpi-card soil">
          <div className="kpi-header">
            <div className="kpi-icon-wrap">🧪</div>
            <span className="kpi-tag">{form.soilSource === "test" ? "Lab Test" : "Location Grid"}</span>
          </div>
          <span className="kpi-title">Soil pH &amp; Nutrition</span>
          <div className="kpi-value-row">
            <span className="kpi-main-val">{soilPH}</span>
            <span className="kpi-unit">pH</span>
          </div>
          <span className="kpi-subtext">
            {Number(soilPH) >= 6 && Number(soilPH) <= 7.5 ? "Optimal nutrient absorption range" : "Requires pH balancing"}
          </span>
        </div>

        {/* Card 4: Farm Microclimate */}
        <div className="kpi-card weather">
          <div className="kpi-header">
            <div className="kpi-icon-wrap">🌤️</div>
            <span className="kpi-tag">Live Sensors</span>
          </div>
          <span className="kpi-title">Microclimate</span>
          <div className="kpi-value-row">
            <span className="kpi-main-val">{temp}°</span>
            <span className="kpi-unit">C</span>
          </div>
          <span className="kpi-subtext">{humidity}% Humidity • {wind} km/h Wind • {rain} mm Rain</span>
        </div>
      </section>

      {/* ── AGRONOMIC ADVISORY STRIP ── */}
      <section className="dash-advisory-strip">
        <div className="strip-info">
          <span className="strip-icon">{isSpraySafe ? "🛡️" : "⚠️"}</span>
          <div className="strip-text">
            <strong>
              {isSpraySafe ? "Favorable Foliar Spray Window" : "Caution: Postpone Foliar Spraying"}
            </strong>
            <p>
              {isSpraySafe
                ? `Wind speed is calm at ${wind} km/h with 0% precipitation risk today. Safe for nutrient & bio-pesticide applications.`
                : `Wind speed (${wind} km/h) or precipitation risk may cause chemical drift or wash-off.`}
            </p>
          </div>
        </div>
        <div className="strip-badge">
          <span>🌾 Crop Stage: {form.cropStage || "Vegetative"}</span>
        </div>
      </section>

      {/* ── TOOL JUMP CARDS ── */}
      <section>
        <div className="dash-section-head">
          <div>
            <h3>Precision Agriculture Modules</h3>
            <p>Dedicated tools designed for systematic farm monitoring, protection, and commerce.</p>
          </div>
        </div>

        <div className="tools-grid" style={{ marginTop: "14px" }}>
          {/* Module 1: Diagnostics */}
          <Link to="/diagnostics" className="tool-card">
            <div>
              <div className="tool-top">
                <div className="tool-icon">🛰️</div>
                <span className="tool-badge featured">SATELLITE &amp; RADAR</span>
              </div>
              <div className="tool-body">
                <h4>Farm Setup &amp; Diagnostics</h4>
                <p>
                  5-step farm locator, Sentinel-2 vegetation canopy indexing, and AI Decision Risk Radar.
                </p>
              </div>
            </div>
            <div className="tool-footer">
              <span>Open Diagnostics</span>
              <span className="arrow">→</span>
            </div>
          </Link>

          {/* Module 2: Crop Doctor */}
          <Link to="/crop-doctor" className="tool-card">
            <div>
              <div className="tool-top">
                <div className="tool-icon">🔬</div>
                <span className="tool-badge featured">AI COMPUTER VISION</span>
              </div>
              <div className="tool-body">
                <h4>Crop Doctor AI Scanner</h4>
                <p>
                  Diagnose fungal, bacterial, and pest diseases instantly from uploaded leaf or fruit photos.
                </p>
              </div>
            </div>
            <div className="tool-footer">
              <span>Scan Crop Health</span>
              <span className="arrow">→</span>
            </div>
          </Link>

          {/* Module 3: Pomegranate AI */}
          <Link to="/pomegranate" className="tool-card">
            <div>
              <div className="tool-top">
                <div className="tool-icon">🍎</div>
                <span className="tool-badge specialist">ICAR SPECIALIST</span>
              </div>
              <div className="tool-body">
                <h4>Pomegranate AI Portal</h4>
                <p>
                  Dedicated ICAR pathology engine for Bacterial Blight (Telya), Anthracnose, and Cercospora.
                </p>
              </div>
            </div>
            <div className="tool-footer">
              <span>Open Pomegranate AI</span>
              <span className="arrow">→</span>
            </div>
          </Link>

          {/* Module 4: Mandi Rates */}
          <Link to="/mandi-rates" className="tool-card">
            <div>
              <div className="tool-top">
                <div className="tool-icon">💰</div>
                <span className="tool-badge">REAL-TIME APMC</span>
              </div>
              <div className="tool-body">
                <h4>APMC Mandi Rates</h4>
                <p>
                  Track daily modal prices, price trend forecasts, and estimate harvest revenue for your acreage.
                </p>
              </div>
            </div>
            <div className="tool-footer">
              <span>View Mandi Prices</span>
              <span className="arrow">→</span>
            </div>
          </Link>

          {/* Module 5: Advisory Dossier */}
          <Link to="/advisory" className="tool-card">
            <div>
              <div className="tool-top">
                <div className="tool-icon">📄</div>
                <span className="tool-badge">PDF &amp; WHATSAPP</span>
              </div>
              <div className="tool-body">
                <h4>Official Advisory Dossier</h4>
                <p>
                  Generate comprehensive agronomic health reports for banks, crop insurance, or WhatsApp sharing.
                </p>
              </div>
            </div>
            <div className="tool-footer">
              <span>Generate Dossier</span>
              <span className="arrow">→</span>
            </div>
          </Link>

          {/* Module 6: History */}
          <Link to="/history" className="tool-card">
            <div>
              <div className="tool-top">
                <div className="tool-icon">🕘</div>
                <span className="tool-badge">TEMPORAL LOG</span>
              </div>
              <div className="tool-body">
                <h4>Field History &amp; Trends</h4>
                <p>
                  Historical Sentinel-2 NDVI trajectory over past months and 7-day microclimate weather forecasts.
                </p>
              </div>
            </div>
            <div className="tool-footer">
              <span>Explore Trends</span>
              <span className="arrow">→</span>
            </div>
          </Link>
        </div>
      </section>

      {/* ── BOTTOM DUAL SECTION: LIVE MAP + MANDI TICKER ── */}
      <section className="dash-bottom-grid">
        {/* Map Snapshot */}
        <div className="dash-panel">
          <div className="dash-panel-head">
            <h4>📍 Active Farm GPS Boundary</h4>
            <Link to="/diagnostics">Expand in Diagnostics →</Link>
          </div>
          <div className="dash-map-preview">
            {mapEmbedUrl ? (
              <iframe
                title="Active Farm Google Map Preview"
                src={mapEmbedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div style={{ display: "grid", placeItems: "center", height: "100%", color: "#64748b" }}>
                <span>GPS coordinates not set</span>
              </div>
            )}
          </div>
          <div style={{ marginTop: "12px", display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#64748b" }}>
            <span>Coordinates: {locationText}</span>
            <span>Sentinel-2 L2A Active</span>
          </div>
        </div>

        {/* Active Crop Mandi Prices Snapshot */}
        <div className="dash-panel">
          <div className="dash-panel-head">
            <h4>💰 Today's {crop} APMC Prices</h4>
            <Link to="/mandi-rates">All Markets →</Link>
          </div>
          <div className="dash-mandi-list">
            <div className="dash-mandi-row">
              <div className="mandi-row-left">
                <strong>Mandya APMC</strong>
                <small>Karnataka • Hybrid Local</small>
              </div>
              <div className="mandi-row-price">
                <strong>₹2,100 / qtl</strong>
                <small style={{ color: "#10b981" }}>▲ +₹150 today</small>
              </div>
            </div>

            <div className="dash-mandi-row">
              <div className="mandi-row-left">
                <strong>Kolar APMC Hub</strong>
                <small>Karnataka • Hybrid Red</small>
              </div>
              <div className="mandi-row-price">
                <strong>₹2,350 / qtl</strong>
                <small style={{ color: "#10b981" }}>▲ +₹200 today</small>
              </div>
            </div>

            <div className="dash-mandi-row">
              <div className="mandi-row-left">
                <strong>Bengaluru (Yeshwanthpur)</strong>
                <small>Karnataka • Grade-A</small>
              </div>
              <div className="mandi-row-price">
                <strong>₹2,200 / qtl</strong>
                <small style={{ color: "#64748b" }}>● Stable</small>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
