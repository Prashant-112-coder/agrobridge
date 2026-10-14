import { Link } from "react-router-dom";
import { useFarm } from "../context/FarmContext";
import { locationData, crops, soilTypes, cropStages } from "../context/farmConstants";
import DecisionRadar from "../components/DecisionRadar";
import "../App.css";

const steps = [
  { icon: "👤", title: "Farmer Profile", short: "Basic farmer details" },
  { icon: "📍", title: "Farm Location", short: "Admin locality & GPS coordinates" },
  { icon: "🌱", title: "Crop Parameters", short: "Crop, acreage & crop age" },
  { icon: "🧪", title: "Soil Intelligence", short: "Lab report or satellite estimate" },
  { icon: "🚜", title: "Farming Practices", short: "Irrigation, stage & history" }
];

export default function FarmDiagnostics() {
  const {
    form,
    update,
    changeCountry,
    changeState,
    changeTaluk,
    useCurrentLocation,
    locationText,
    response,
    soilResult,
    weatherData,
    farmHealth,
    analyzing,
    soilLoading,
    weatherLoading,
    locationLoading,
    analysisDone,
    analyzeFarm
  } = useFarm();

  const countries = Object.keys(locationData);
  const states = Object.keys(locationData[form.country] || {});
  const taluks = Object.keys(locationData[form.country]?.[form.state] || {});
  const villages = locationData[form.country]?.[form.state]?.[form.taluk] || [];

  return (
    <div className="diagnostics-page-container" style={{ animation: "fadeIn 0.3s ease" }}>
      {/* ── PAGE HEADER ── */}
      <section className="farm-header" style={{ marginBottom: "20px" }}>
        <div>
          <div className="title-row">
            <span className="title-icon">🛰️</span>
            <h1>Farm Setup &amp; Satellite Diagnostics</h1>
          </div>
          <p>
            Configure your farm geolocation and field parameters for Sentinel-2 satellite analysis &amp; AI risk evaluation.
          </p>
        </div>
        <div className="farm-banner-art" aria-hidden="true">
          <span>🌳</span>
          <span>🛰️</span>
          <span>🏡</span>
          <span>🚜</span>
        </div>
      </section>

      {/* ── 5-STEP FORM WORKSPACE ── */}
      <section className="farm-workspace" id="farm-form">
        {/* Step rail */}
        <div className="step-rail" aria-label="Farm configuration steps">
          {steps.map((step, index) => {
            const completed =
              analysisDone ||
              (index === 0 && form.farmerName) ||
              (index === 1 && form.country && form.state && form.taluk && form.village) ||
              (index === 2 && form.crop) ||
              (index === 3 && form.soilSource) ||
              (index === 4 && (form.irrigation || form.cropStage));

            return (
              <div
                className={`step-item ${completed ? "completed" : ""}`}
                key={step.title}
              >
                <div className="step-number">{completed ? "✓" : index + 1}</div>
                {index < steps.length - 1 && <div className="step-line" />}
                <div className="step-icon">{step.icon}</div>
                <div className="step-copy">
                  <strong>{step.title}</strong>
                  <small>{step.short}</small>
                </div>
              </div>
            );
          })}
        </div>

        {/* Form fields */}
        <div className="farm-form-card">
          <div className="form-card-head">
            <div>
              <span className="mini-label">FIELD PARAMETERS</span>
              <h2>Farm Geolocation &amp; Crop Profile</h2>
              <p>Values entered here update the entire AgroBridge ecosystem automatically.</p>
            </div>
            <span className="steps-pill">5 MODULES</span>
          </div>

          {/* Block 1: Farmer */}
          <div className="form-block">
            <div className="block-label">
              <span>1</span>
              <div>
                <strong>Farmer Information</strong>
                <small>Owner / operator profile</small>
              </div>
            </div>
            <div className="fields one">
              <Field label="Farmer Name" icon="👤">
                <input
                  value={form.farmerName}
                  onChange={(e) => update("farmerName", e.target.value)}
                  placeholder="Enter farmer full name"
                />
              </Field>
            </div>
          </div>

          {/* Block 2: Location */}
          <div className="form-block">
            <div className="block-label">
              <span>2</span>
              <div>
                <strong>Farm Location</strong>
                <small>Select locality and calibrate GPS coordinates</small>
              </div>
            </div>
            <div className="fields location-fields">
              <div className="location-selects">
                <Field label="Country" icon="🌍">
                  <select
                    value={form.country}
                    onChange={(e) => changeCountry(e.target.value)}
                  >
                    <option value="">Select country</option>
                    {countries.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </Field>

                <Field label="State" icon="🏛️">
                  <select
                    value={form.state}
                    onChange={(e) => changeState(e.target.value)}
                    disabled={!form.country}
                  >
                    <option value="">Select state</option>
                    {states.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </Field>

                <Field label="Taluk / Tehsil" icon="📌">
                  <select
                    value={form.taluk}
                    onChange={(e) => changeTaluk(e.target.value)}
                    disabled={!form.state}
                  >
                    <option value="">Select taluk</option>
                    {taluks.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </Field>

                <Field label="Village / Locality" icon="🏘️">
                  <select
                    value={form.village}
                    onChange={(e) => update("village", e.target.value)}
                    disabled={!form.taluk}
                  >
                    <option value="">Select village</option>
                    {villages.map((v) => (
                      <option key={v}>{v}</option>
                    ))}
                  </select>
                </Field>
              </div>

              <div className="location-row">
                <button
                  type="button"
                  className="location-button"
                  onClick={useCurrentLocation}
                  disabled={locationLoading}
                >
                  {locationLoading ? "⌛ Locating via GPS..." : "📍 Use My Current Location (GPS)"}
                </button>
                <span className="location-readout">Selected: {locationText}</span>
              </div>

              <Field label="Latitude" icon="⌖">
                <input
                  type="number"
                  step="any"
                  value={form.latitude}
                  onChange={(e) => update("latitude", e.target.value)}
                  placeholder="e.g. 12.5218"
                />
              </Field>

              <Field label="Longitude" icon="🧭">
                <input
                  type="number"
                  step="any"
                  value={form.longitude}
                  onChange={(e) => update("longitude", e.target.value)}
                  placeholder="e.g. 76.8951"
                />
              </Field>

              <small className="helper-text">
                ✓ Precise coordinates are used to query Sentinel-2 L2A multispectral canopy tiles and microclimate forecasts.
              </small>
            </div>
          </div>

          {/* Block 3: Crop */}
          <div className="form-block">
            <div className="block-label">
              <span>3</span>
              <div>
                <strong>Crop Information</strong>
                <small>Active crop and acreage</small>
              </div>
            </div>
            <div className="fields three">
              <Field label="Crop" icon="🌾">
                <select
                  value={form.crop}
                  onChange={(e) => update("crop", e.target.value)}
                >
                  <option value="">Select crop</option>
                  {crops.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </Field>

              <Field label="Farm Area (acres)" icon="📐">
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={form.area}
                  onChange={(e) => update("area", e.target.value)}
                  placeholder="e.g. 2.5"
                />
              </Field>

              <Field label="Crop Age (days)" icon="📅">
                <input
                  type="number"
                  min="0"
                  value={form.cropAge}
                  onChange={(e) => update("cropAge", e.target.value)}
                  placeholder="e.g. 35"
                />
              </Field>
            </div>
          </div>

          {/* Block 4: Soil */}
          <div className="form-block">
            <div className="block-label">
              <span>4</span>
              <div>
                <strong>Soil Information</strong>
                <small>Choose soil test report or global estimate</small>
              </div>
            </div>
            <div className="fields soil-area">
              <div className="soil-choice-title">Do you have an active Soil Test Report?</div>
              <div className="choice-row">
                <button
                  type="button"
                  className={`soil-choice ${form.soilSource === "test" ? "selected" : ""}`}
                  onClick={() => update("soilSource", "test")}
                >
                  <span>{form.soilSource === "test" ? "◉" : "◯"}</span>
                  Yes, I have a soil test report
                </button>
                <button
                  type="button"
                  className={`soil-choice ${form.soilSource === "none" ? "selected" : ""}`}
                  onClick={() => update("soilSource", "none")}
                >
                  <span>{form.soilSource === "none" ? "◉" : "◯"}</span>
                  No, use location-based soil grid
                </button>
              </div>

              {form.soilSource === "test" ? (
                <div className="fields three soil-test-fields">
                  <Field label="Soil pH" icon="🧪">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="14"
                      value={form.soilPH}
                      onChange={(e) => update("soilPH", e.target.value)}
                      placeholder="e.g. 6.5"
                    />
                  </Field>
                  <Field label="Nitrogen (N)" icon="🧪">
                    <input
                      value={form.nitrogen}
                      onChange={(e) => update("nitrogen", e.target.value)}
                      placeholder="e.g. Medium"
                    />
                  </Field>
                  <Field label="Phosphorus (P)" icon="🧪">
                    <input
                      value={form.phosphorus}
                      onChange={(e) => update("phosphorus", e.target.value)}
                      placeholder="e.g. High"
                    />
                  </Field>
                  <Field label="Potassium (K)" icon="🧪">
                    <input
                      value={form.potassium}
                      onChange={(e) => update("potassium", e.target.value)}
                      placeholder="e.g. Medium"
                    />
                  </Field>
                  <Field label="Organic Carbon (%)" icon="🧬">
                    <input
                      type="number"
                      step="0.1"
                      value={form.organicCarbon}
                      onChange={(e) => update("organicCarbon", e.target.value)}
                      placeholder="e.g. 0.8"
                    />
                  </Field>
                  <Field label="Soil Type" icon="🌱">
                    <select
                      value={form.soilType}
                      onChange={(e) => update("soilType", e.target.value)}
                    >
                      <option value="">Select soil type</option>
                      {soilTypes.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </Field>
                </div>
              ) : (
                <div className="info-strip">
                  ⓘ <span>Location-based soil database (OpenLandMap Global Grids) will estimate pH and carbon for your coordinates.</span>
                </div>
              )}
            </div>
          </div>

          {/* Block 5: Farming practices */}
          <div className="form-block last">
            <div className="block-label">
              <span>5</span>
              <div>
                <strong>Farming Practices</strong>
                <small>Irrigation and growth stage context</small>
              </div>
            </div>
            <div className="fields two">
              <Field label="Irrigation Method" icon="💧">
                <select
                  value={form.irrigation}
                  onChange={(e) => update("irrigation", e.target.value)}
                >
                  <option value="">Select method</option>
                  <option>Drip</option>
                  <option>Sprinkler</option>
                  <option>Flood</option>
                  <option>Rainfed</option>
                  <option>Other</option>
                </select>
              </Field>

              <Field label="Previous Crop" icon="🌾">
                <select
                  value={form.previousCrop}
                  onChange={(e) => update("previousCrop", e.target.value)}
                >
                  <option value="">Select crop</option>
                  {crops.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </Field>

              <Field label="Planting Date" icon="📅">
                <input
                  type="date"
                  value={form.plantingDate}
                  onChange={(e) => update("plantingDate", e.target.value)}
                />
              </Field>

              <Field label="Current Crop Stage" icon="🌿">
                <select
                  value={form.cropStage}
                  onChange={(e) => update("cropStage", e.target.value)}
                >
                  <option value="">Select stage</option>
                  {cropStages.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </Field>
            </div>
          </div>
        </div>
      </section>

      {/* ── ANALYZE PANEL ── */}
      <section className="analyze-panel" style={{ marginTop: "20px" }}>
        <div className="why-copy">
          <div className="why-icon">🤖</div>
          <div>
            <strong>Automated Satellite &amp; Soil Fusion</strong>
            <p>
              We merge European Space Agency Sentinel-2 imagery, OpenLandMap soil profiles, and local microclimate sensor feeds to evaluate crop health and disease risks.
            </p>
          </div>
        </div>

        <button
          type="button"
          className={`analyze-cta ${analyzing ? "is-analyzing" : ""} ${analysisDone ? "is-done" : ""}`}
          onClick={analyzeFarm}
          disabled={analyzing}
        >
          <span className="cta-edge" />
          <span className="cta-inner">
            <span>{analyzing ? "⟳" : analysisDone ? "✓" : "🌿"}</span>
            <strong>
              {analyzing
                ? "Analyzing Farm Satellites..."
                : analysisDone
                ? "Re-Analyze My Farm"
                : "Analyze My Farm"}
            </strong>
            <b>→</b>
          </span>
        </button>
      </section>

      {/* Quick Action Navigation Strip */}
      <div className="quick-actions-bar" style={{ marginTop: "24px" }}>
        <div className="quick-actions-info">
          <span>⚡ INTEGRATED AGRI-TECH MODULES</span>
          <strong>Field Intelligence Ready For Deployment</strong>
        </div>
        <div className="quick-actions-btns">
          <Link to="/advisory" className="qa-btn qa-pdf" style={{ textDecoration: "none" }}>
            📄 View &amp; Print Advisory Dossier
          </Link>
          <Link to="/mandi-rates" className="qa-btn qa-mandi" style={{ textDecoration: "none" }}>
            💰 Live APMC Mandi Prices
          </Link>
          <Link to="/crop-doctor" className="qa-btn" style={{ background: "#0284c7", color: "#fff", textDecoration: "none" }}>
            🔬 Open Crop Doctor AI
          </Link>
        </div>
      </div>

      {/* ── LIVE GOOGLE FARM MAP ── */}
      <LiveFarmMap
        latitude={form.latitude}
        longitude={form.longitude}
        weather={weatherData}
        locationText={locationText}
      />

      {/* ── DECISION RADAR ── */}
      <DecisionRadar
        form={form}
        response={response}
        soilResult={soilResult}
        weatherData={weatherData}
      />

      {/* ── SATELLITE, SOIL, WEATHER STATS ── */}
      <section className="data-section" style={{ marginTop: "24px" }}>
        <div className="section-title">
          <div>
            <span>FIELD SENSORS</span>
            <h2>Soil &amp; Climate Signals</h2>
          </div>
          <em>{weatherLoading || soilLoading ? "FETCHING" : "LIVE SENSORS"}</em>
        </div>

        <div className="metrics">
          <Metric
            icon="❤️"
            label="FARM HEALTH"
            value={farmHealth?.score ?? "--"}
            suffix="/ 100"
            status={farmHealth?.status || "GOOD"}
          />
          <Metric
            icon="🛰️"
            label="SENTINEL-2 NDVI"
            value={farmHealth ? farmHealth.ndvi.toFixed(2) : "--"}
            status="CANOPY VIGOR"
          />
          <Metric
            icon="🧪"
            label="SOIL pH"
            value={soilResult?.soil?.ph ?? "--"}
            status={form.soilSource === "test" ? "FARMER TEST" : "OPENLANDMAP"}
          />
          <Metric
            icon="🌡️"
            label="TEMPERATURE"
            value={weatherData?.weather?.temperature ?? "--"}
            suffix="°C"
            status="CURRENT"
          />
        </div>
      </section>

      {/* Technical Response JSON (Collapsed) */}
      {response && (
        <details className="response-card" style={{ marginTop: "24px" }}>
          <summary style={{ cursor: "pointer", fontWeight: 700 }}>
            Technical Sentinel-2 API Response &amp; Metadata
          </summary>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </details>
      )}
    </div>
  );
}

function LiveFarmMap({ latitude, longitude, weather, locationText }) {
  const lat = Number(latitude);
  const lng = Number(longitude);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

  const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}&z=15&output=embed`;
  const temp = weather?.weather?.temperature;
  const humidity = weather?.weather?.humidity;
  const precipitation = weather?.weather?.precipitation;
  const wind = weather?.weather?.windSpeed;

  return (
    <section className="live-farm-map" aria-label="Live farm map and weather">
      <div className="live-map-head">
        <div>
          <span>GEOSPATIAL COORDINATES</span>
          <h2>Google Satellite Boundary &amp; Real-Time Weather</h2>
          <p>Sentinel-2 coordinates: {locationText}</p>
        </div>
        <strong>● LIVE SATELLITE</strong>
      </div>
      <div className="live-map-body">
        <div className="google-map-frame">
          <iframe
            title="Google Map of selected farm"
            src={mapUrl}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
        <div className="map-weather-panel">
          <div className="weather-location">
            <span>📍</span>
            <div>
              <strong>Active Farm Location</strong>
              <small>{locationText}</small>
            </div>
          </div>
          <div className="weather-now">
            <span>🌤️</span>
            <div>
              <small>FARM TEMPERATURE</small>
              <strong>{temp ?? "--"}<em>°C</em></strong>
            </div>
          </div>
          <div className="map-weather-grid">
            <div>
              <span>💧</span>
              <small>Humidity</small>
              <strong>{humidity ?? "--"}%</strong>
            </div>
            <div>
              <span>🌧️</span>
              <small>Rainfall</small>
              <strong>{precipitation ?? "--"} mm</strong>
            </div>
            <div>
              <span>💨</span>
              <small>Wind Speed</small>
              <strong>{wind ?? "--"} km/h</strong>
            </div>
          </div>
          <div className="weather-source">
            ✓ Live microclimate feed calibrated to active farm coordinates
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({ label, icon, children }) {
  return (
    <label className="field">
      <span>{label}</span>
      <div className="input-wrap">
        <i>{icon}</i>
        {children}
      </div>
    </label>
  );
}

function Metric({ icon, label, value, suffix = "", status }) {
  return (
    <div className="metric-card">
      <span className="metric-icon">{icon}</span>
      <span className="metric-label">{label}</span>
      <div className="metric-value">
        <strong>{value}</strong>
        {suffix && <small>{suffix}</small>}
      </div>
      <span className="metric-status">{status}</span>
    </div>
  );
}
