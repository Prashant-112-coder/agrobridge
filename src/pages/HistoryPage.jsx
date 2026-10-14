import { useFarm } from "../context/FarmContext";
import FarmHealthHistory from "../components/FarmHealthHistory";
import WeatherForecast from "../components/WeatherForecast";
import "../components/FarmHealthHistory.css";
import "../components/WeatherForecast.css";

export default function HistoryPage() {
  const { form, analysisDone, weatherData, locationText } = useFarm();

  return (
    <div className="history-page-container" style={{ animation: "fadeIn 0.3s ease" }}>
      {/* ── HEADER ── */}
      <section className="farm-header" style={{ marginBottom: "20px" }}>
        <div>
          <div className="title-row">
            <span className="title-icon">🕘</span>
            <h1>Temporal Field Health &amp; Weather History</h1>
          </div>
          <p>
            Multi-temporal Sentinel-2 satellite NDVI trajectory tracking crop vigor changes across seasons at {locationText}.
          </p>
        </div>
        <div className="farm-banner-art" aria-hidden="true">
          <span>📅</span>
          <span>🛰️</span>
          <span>🌱</span>
          <span>🌦️</span>
        </div>
      </section>

      {/* Historical Vegetation Index Trajectory */}
      <FarmHealthHistory
        latitude={form.latitude}
        longitude={form.longitude}
        analysisDone={analysisDone}
      />

      {/* Multi-Day Weather Forecast */}
      <div style={{ marginTop: "28px" }}>
        <WeatherForecast weatherData={weatherData} />
      </div>
    </div>
  );
}
