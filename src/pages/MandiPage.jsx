import { useFarm } from "../context/FarmContext";
import MandiRates from "../components/MandiRates";
import "../components/MandiRates.css";

export default function MandiPage() {
  const { form } = useFarm();

  return (
    <div className="mandi-page-container" style={{ animation: "fadeIn 0.3s ease" }}>
      {/* ── HEADER ── */}
      <section className="farm-header" style={{ marginBottom: "20px" }}>
        <div>
          <div className="title-row">
            <span className="title-icon">💰</span>
            <h1>APMC Mandi Rates &amp; Market Intelligence</h1>
          </div>
          <p>
            Real-time daily modal prices, price trend forecasts, and harvest revenue estimators across Karnataka and major Indian APMC markets.
          </p>
        </div>
        <div className="farm-banner-art" aria-hidden="true">
          <span>🌾</span>
          <span>📈</span>
          <span>🚚</span>
          <span>🏛️</span>
        </div>
      </section>

      {/* Embedded Mandi Rates Module */}
      <MandiRates form={form} />
    </div>
  );
}
