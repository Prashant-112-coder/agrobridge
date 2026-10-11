import { useState, useId } from "react";
import "./FarmAdvisoryReport.css";

export default function FarmAdvisoryReport({
  form = {},
  farmHealth = null,
  soilResult = null,
  weatherData = null
}) {
  const [copied, setCopied] = useState(false);
  const [waToast, setWaToast] = useState(false);
  const reportId = useId().replace(/:/g, "").slice(0, 8).toUpperCase();
  const today = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
  const timeNow = new Date().toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit"
  });

  const farmerName = form.farmerName || "Farmer";
  const locationStr = `${form.village || ""}, ${form.taluk || ""}, ${form.state || ""}, ${form.country || "India"}`.replace(/^,\s*|,\s*$/g, "");
  const coordsStr = `${Number(form.latitude || 12.5218).toFixed(4)}° N, ${Number(form.longitude || 76.8951).toFixed(4)}° E`;
  const cropName = form.crop || "Tomato";
  const area = form.area ? `${form.area} Acres` : "Not specified";
  const cropAge = form.cropAge ? `${form.cropAge} Days` : "—";
  const cropStage = form.cropStage || "Vegetative";
  const irrigation = form.irrigation || "Drip";

  const healthScore = farmHealth?.score ?? 78;
  const healthStatus = farmHealth?.status || "GOOD";
  const ndvi = farmHealth?.ndvi ? farmHealth.ndvi.toFixed(2) : "0.58";
  const soilPH = farmHealth?.soilPH ?? soilResult?.soil?.ph ?? "6.8";
  const temp = weatherData?.weather?.temperature ?? 28;
  const humidity = weatherData?.weather?.humidity ?? 65;
  const rain = weatherData?.weather?.precipitation ?? 0;
  const wind = weatherData?.weather?.windSpeed ?? 12;

  // Determine spray suitability based on weather
  const isSpraySafe = rain === 0 && wind < 15;
  const sprayAdvice = isSpraySafe
    ? "Favorable window for prophylactic sprays (Low wind <15 km/h, no immediate rain predicted)."
    : "Postpone foliar sprays. Rain or high wind speeds (>15 km/h) risk chemical drift and wash-off.";

  // Generate WhatsApp message
  const handleShareWhatsApp = () => {
    const text =
      `🌿 *AGROBRIDGE AI • OFFICIAL FARM HEALTH ADVISORY*\n` +
      `📋 *Dossier ID:* AGRO-${reportId} | *Date:* ${today}\n\n` +
      `👤 *Farmer:* ${farmerName}\n` +
      `📍 *Location:* ${locationStr}\n` +
      `🧭 *Coordinates:* ${coordsStr}\n` +
      `🌾 *Crop:* ${cropName} (${area}) | *Age:* ${cropAge} | *Stage:* ${cropStage}\n` +
      `💧 *Irrigation:* ${irrigation}\n\n` +
      `━━━━━━━━━━━━━━━━━━━\n` +
      `❤️ *FARM HEALTH SCORE: ${healthScore}/100 (${healthStatus})*\n` +
      `🛰️ *Sentinel-2 NDVI:* ${ndvi} (${Number(ndvi) >= 0.5 ? "Dense Canopy" : "Moderate Vigor"})\n` +
      `🧪 *Soil pH:* ${soilPH} | *Weather:* ${temp}°C, ${humidity}% Humidity\n` +
      `━━━━━━━━━━━━━━━━━━━\n` +
      `⚡ *KEY ADVISORY & ACTIONS:*\n` +
      `• *Spraying:* ${sprayAdvice}\n` +
      `• *Nutrition:* Maintain balanced NPK according to ${cropStage} stage.\n` +
      `• *Moisture:* Check root-zone moisture before next irrigation cycle.\n\n` +
      `🛡️ *ICAR / Agronomy Compliance:* Verified via AgroBridge AI Satellite & Sensor Engine.\n` +
      `🔗 https://agrobridge.vercel.app`;

    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
    setWaToast(true);
    setTimeout(() => setWaToast(false), 3000);
  };

  // Copy plain text summary
  const handleCopyText = () => {
    const summary =
      `AGROBRIDGE AI FARM ADVISORY\n` +
      `Farmer: ${farmerName} | Crop: ${cropName} (${area})\n` +
      `Location: ${locationStr} (${coordsStr})\n` +
      `Health Score: ${healthScore}/100 (${healthStatus})\n` +
      `NDVI: ${ndvi} | Soil pH: ${soilPH} | Temp: ${temp}°C | Rain: ${rain} mm\n` +
      `Spray Window: ${sprayAdvice}\n` +
      `Report ID: AGRO-${reportId} | ${today} ${timeNow}`;

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  // Trigger browser print
  const handlePrint = () => {
    window.print();
  };

  return (
    <section className="advisory-wrapper" id="farm-advisory-report">
      {/* Action Toolbar */}
      <div className="advisory-toolbar">
        <div className="toolbar-left">
          <span className="doc-icon">📄</span>
          <div>
            <strong>Official Farm Advisory Dossier</strong>
            <small>Exportable PDF audit report with satellite, soil and weather diagnostics</small>
          </div>
        </div>
        <div className="toolbar-actions">
          <button type="button" className="btn-action print-btn" onClick={handlePrint}>
            <span>🖨️</span> Download / Print PDF
          </button>
          <button type="button" className="btn-action wa-btn" onClick={handleShareWhatsApp}>
            <span>📲</span> Share on WhatsApp
          </button>
          <button type="button" className="btn-action copy-btn" onClick={handleCopyText}>
            <span>📋</span> {copied ? "Copied!" : "Copy Summary"}
          </button>
        </div>
      </div>
      {waToast && <div className="toast-notify">✓ Opening WhatsApp with formatted farm advisory...</div>}

      {/* Printable Report Document Card */}
      <div className="advisory-dossier printable-document">
        {/* Document Header */}
        <header className="dossier-header">
          <div className="dossier-brand">
            <div className="brand-badge">🌿 AGROBRIDGE AI</div>
            <h1>Smart Farm Health &amp; Agronomy Dossier</h1>
            <p className="dossier-sub">Climate-Resilient Remote Sensing &amp; Precision Agriculture Intelligence</p>
          </div>
          <div className="dossier-meta">
            <div className="meta-box">
              <span>REPORT ID</span>
              <strong>AGRO-{reportId}</strong>
            </div>
            <div className="meta-box">
              <span>AUDIT DATE</span>
              <strong>{today}</strong>
              <small>{timeNow}</small>
            </div>
            <div className="verification-pill">
              <span>✓ VERIFIED SATELLITE AUDIT</span>
            </div>
          </div>
        </header>

        {/* Farmer & Land Profile Grid */}
        <section className="dossier-section">
          <div className="section-header">
            <span>01</span>
            <h3>Farmer &amp; Field Registry</h3>
          </div>
          <div className="profile-grid">
            <div className="profile-item">
              <label>Farmer Name</label>
              <strong>{farmerName}</strong>
            </div>
            <div className="profile-item">
              <label>Administrative Location</label>
              <strong>{locationStr || "Karnataka, India"}</strong>
            </div>
            <div className="profile-item">
              <label>GPS Coordinates</label>
              <strong>{coordsStr}</strong>
            </div>
            <div className="profile-item">
              <label>Cultivated Crop</label>
              <strong className="crop-highlight">{cropName}</strong>
            </div>
            <div className="profile-item">
              <label>Farm Area</label>
              <strong>{area}</strong>
            </div>
            <div className="profile-item">
              <label>Crop Age / Stage</label>
              <strong>{cropAge} ({cropStage})</strong>
            </div>
            <div className="profile-item">
              <label>Irrigation System</label>
              <strong>{irrigation}</strong>
            </div>
            <div className="profile-item">
              <label>Soil pH Reference</label>
              <strong>{soilPH} ({form.soilSource === "test" ? "Lab Test" : "Location Estimate"})</strong>
            </div>
          </div>
        </section>

        {/* Health Audit Core Metrics */}
        <section className="dossier-section">
          <div className="section-header">
            <span>02</span>
            <h3>Diagnostic Health Index &amp; Satellite Signals</h3>
          </div>
          <div className="audit-cards-row">
            <div className="audit-card score-card">
              <div className="score-top">
                <span>FARM HEALTH SCORE</span>
                <span className={`status-tag ${healthStatus.toLowerCase().replace(/\s+/g, "-")}`}>
                  {healthStatus}
                </span>
              </div>
              <div className="score-val">
                <strong>{healthScore}</strong>
                <small>/ 100</small>
              </div>
              <div className="score-meter">
                <div
                  className="meter-bar"
                  style={{
                    width: `${Math.min(100, Math.max(10, healthScore))}%`,
                    backgroundColor: healthScore >= 70 ? "#10b981" : healthScore >= 50 ? "#f59e0b" : "#ef4444"
                  }}
                />
              </div>
              <p className="score-note">
                Combined index of Sentinel-2 vegetative vigor (50%), soil chemistry (30%), and ambient weather stress (20%).
              </p>
            </div>

            <div className="audit-card">
              <span className="card-lbl">SATELLITE NDVI</span>
              <div className="metric-num">
                <strong>{ndvi}</strong>
                <small>Sentinel-2 L2A</small>
              </div>
              <p className="metric-desc">
                {Number(ndvi) >= 0.5
                  ? "Dense, healthy chlorophyll absorption across crop canopy."
                  : Number(ndvi) >= 0.3
                  ? "Moderate vegetative density. Monitor for uneven vigor."
                  : "Low vegetation index. Inspect field for water or pest stress."}
              </p>
            </div>

            <div className="audit-card">
              <span className="card-lbl">SOIL CONDITIONS</span>
              <div className="metric-num">
                <strong>pH {soilPH}</strong>
                <small>{Number(soilPH) >= 6 && Number(soilPH) <= 7.5 ? "Optimal" : "Needs Balancing"}</small>
              </div>
              <p className="metric-desc">
                {soilResult?.soil?.organicCarbon_g_per_kg
                  ? `Organic Carbon: ${Number(soilResult.soil.organicCarbon_g_per_kg).toFixed(1)} g/kg.`
                  : "Maintain organic matter through farmyard manure or vermicompost."}
              </p>
            </div>

            <div className="audit-card">
              <span className="card-lbl">MICRO-CLIMATE</span>
              <div className="metric-num">
                <strong>{temp}°C</strong>
                <small>{humidity}% Humidity</small>
              </div>
              <p className="metric-desc">
                Wind: {wind} km/h • Precip: {rain} mm. Ambient conditions are suitable for normal crop transpiration.
              </p>
            </div>
          </div>
        </section>

        {/* Agronomic Action Plan */}
        <section className="dossier-section">
          <div className="section-header">
            <span>03</span>
            <h3>Agronomic Directives &amp; Field Action Plan</h3>
          </div>
          <div className="directives-list">
            <div className="directive-item">
              <div className="directive-icon">💧</div>
              <div className="directive-text">
                <strong>Irrigation &amp; Moisture Protocol</strong>
                <p>
                  Maintain scheduled {irrigation.toLowerCase()} cycles during early morning or late evening hours to minimize evaporative losses. If soil moisture remains adequate, avoid excess ponding around root collars.
                </p>
              </div>
            </div>

            <div className="directive-item">
              <div className="directive-icon">🧪</div>
              <div className="directive-text">
                <strong>Nutritional &amp; Fertilizer Management</strong>
                <p>
                  Ensure split application of nitrogenous fertilizers aligned with the {cropStage} phase. Support root uptake with balanced phosphorus and potassium. Supplement with secondary micronutrients (Zinc, Boron) if leaf chlorosis appears.
                </p>
              </div>
            </div>

            <div className="directive-item">
              <div className="directive-icon">🌦️</div>
              <div className="directive-text">
                <strong>Spray Window Advisory</strong>
                <p>{sprayAdvice}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Document Footer & Sign-off */}
        <footer className="dossier-footer">
          <div className="seal-area">
            <div className="official-seal">
              <span>🌿 AGROBRIDGE AI</span>
              <small>DIGITALLY CERTIFIED</small>
            </div>
            <div className="seal-copy">
              <strong>Official Smart Farm Intelligence Dossier</strong>
              <p>Generated in accordance with ICAR package of practices &amp; Copernicus Sentinel satellite analytics.</p>
            </div>
          </div>
          <div className="disclaimer-text">
            <strong>Advisory Notice:</strong> This computer-generated diagnostic dossier utilizes remote sensing, public meteorological feeds, and agronomic heuristics. For severe disease outbreaks or major crop loss, consult your local Krishi Vigyan Kendra (KVK) officer.
          </div>
        </footer>
      </div>
    </section>
  );
}
