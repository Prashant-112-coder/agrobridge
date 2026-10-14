import { useFarm } from "../context/FarmContext";
import FarmAdvisoryReport from "../components/FarmAdvisoryReport";
import "../components/FarmAdvisoryReport.css";

export default function AdvisoryPage() {
  const { form, farmHealth, soilResult, weatherData, response } = useFarm();

  return (
    <div className="advisory-page-container" style={{ animation: "fadeIn 0.3s ease" }}>
      {/* ── HEADER ── */}
      <section className="farm-header" style={{ marginBottom: "20px" }}>
        <div>
          <div className="title-row">
            <span className="title-icon">📄</span>
            <h1>Official Farm Advisory Dossier</h1>
          </div>
          <p>
            Generate and export an official ICAR-aligned farm health dossier with satellite NDVI records, soil parameters, and tailored spray guidelines.
          </p>
        </div>
        <div className="farm-banner-art" aria-hidden="true">
          <span>📋</span>
          <span>🖨️</span>
          <span>🌿</span>
          <span>🛡️</span>
        </div>
      </section>

      {/* Embedded Advisory Report Component */}
      <FarmAdvisoryReport
        form={form}
        farmHealth={farmHealth}
        soilResult={soilResult}
        weatherData={weatherData}
        response={response}
      />
    </div>
  );
}
