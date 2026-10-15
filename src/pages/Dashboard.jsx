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
      {/* ── IPHONE-STANDARD GLASS WIDGET: FARM HEALTH (Page 1 Guide) ── */}
      <section className="iphone-glass-card">
        {/* Top bar of widget */}
        <div className="ios-widget-topbar">
          <span className="ios-brand-label">AGROBRIDGE</span>
          <div className="ios-badge-group">
            <span className="ios-field-pill">FIELD OVERVIEW</span>
            <span className="ios-location-pill">📍 {village}, {taluk} ({state}) • {crop} ({area})</span>
          </div>
        </div>

        {/* Headline Row: Title, Subtitle & Interactive Actions */}
        <div className="ios-widget-headline-row">
          <div className="ios-widget-title-area">
            <h2>Farm health</h2>
            <p>Signals into clear next steps • Welcome back, {farmerName}</p>
          </div>
          <div className="ios-widget-actions">
            <button
              type="button"
              className="ios-btn-primary"
              onClick={analyzeFarm}
              disabled={analyzing}
            >
              <span>{analyzing ? "⟳" : "🛰️"}</span>
              <span>{analyzing ? "Syncing..." : "Re-Analyze Satellite"}</span>
            </button>
            <Link to="/diagnostics" className="ios-btn-secondary">
              <span>⚙️</span>
              <span>Farm Settings</span>
            </Link>
          </div>
        </div>

        {/* 4 Frosted Capsule Metrics in a row (Matching Page 1 Mockup) */}
        <div className="ios-metric-capsules">
          {/* NDVI Capsule */}
          <div className="ios-capsule">
            <span className="ios-capsule-lbl">NDVI</span>
            <div className="ios-capsule-val-row">
              <strong className="ios-capsule-val">{ndvi}</strong>
              <span className="ios-capsule-badge">{Number(ndvi) >= 0.5 ? "Dense" : "Moderate"}</span>
            </div>
            <span className="ios-capsule-sub">Sentinel-2 10m Canopy</span>
          </div>

          {/* RISK Capsule */}
          <div className="ios-capsule">
            <span className="ios-capsule-lbl">RISK</span>
            <div className="ios-capsule-val-row">
              <strong className={`ios-capsule-val risk-${healthStatus.toLowerCase()}`}>
                {healthStatus === "GOOD" ? "LOW" : healthStatus}
              </strong>
              <span className="ios-capsule-badge">{healthScore}/100</span>
            </div>
            <span className="ios-capsule-sub">Composite Health Index</span>
          </div>

          {/* WEATHER Capsule */}
          <div className="ios-capsule">
            <span className="ios-capsule-lbl">WEATHER</span>
            <div className="ios-capsule-val-row">
              <strong className="ios-capsule-val">{temp}°</strong>
              <span className="ios-capsule-badge">{rain === 0 ? "0mm rain" : `${rain}mm`}</span>
            </div>
            <span className="ios-capsule-sub">{humidity}% Hum • {wind} km/h Wind</span>
          </div>

          {/* SOIL Capsule */}
          <div className="ios-capsule">
            <span className="ios-capsule-lbl">SOIL PH</span>
            <div className="ios-capsule-val-row">
              <strong className="ios-capsule-val">{soilPH}</strong>
              <span className="ios-capsule-badge">pH</span>
            </div>
            <span className="ios-capsule-sub">{form.soilSource === "test" ? "Lab Test" : "Location Grid"}</span>
          </div>
        </div>

        {/* Priority Action Capsule (Matching Page 1 Mockup) */}
        <div className="ios-priority-action-capsule">
          <div className="priority-label-wrap">
            <span className="priority-dot" />
            <strong>Priority action</strong>
          </div>
          <p>
            Check soil moisture before irrigation •{" "}
            {isSpraySafe
              ? `Favorable foliar spray window today (calm wind at ${wind} km/h, 0% rain risk). Safe for nutrient application.`
              : `Caution: Postpone foliar spraying due to wind (${wind} km/h) or precipitation risk.`}
          </p>
          <span className="priority-stage-tag">🌾 {form.cropStage || "Vegetative"}</span>
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
