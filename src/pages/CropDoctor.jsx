import { Link } from "react-router-dom";
import { useFarm } from "../context/FarmContext";
import DiseaseScanner from "../components/DiseaseScanner";
import "../components/DiseaseScanner.css";

export default function CropDoctor() {
  const { form } = useFarm();
  const crop = form.crop || "Tomato";

  return (
    <div className="crop-doctor-page" style={{ animation: "fadeIn 0.3s ease" }}>
      {/* ── HEADER ── */}
      <section className="farm-header" style={{ marginBottom: "20px" }}>
        <div>
          <div className="title-row">
            <span className="title-icon">🔬</span>
            <h1>Crop Doctor &amp; AI Disease Scanner</h1>
          </div>
          <p>
            Upload or capture a photo of affected leaves, stems, or fruits for real-time computer vision diagnosis and ICAR treatment protocols.
          </p>
        </div>
        <div className="farm-banner-art" aria-hidden="true">
          <span>🍃</span>
          <span>🔍</span>
          <span>🌿</span>
          <span>🛡️</span>
        </div>
      </section>

      {/* Pomegranate Alert Banner if crop is Pomegranate */}
      {crop.toLowerCase() === "pomegranate" && (
        <div
          style={{
            background: "linear-gradient(135deg, #fef2f2, #fff1f2)",
            border: "1px solid #fecaca",
            borderRadius: "14px",
            padding: "16px 20px",
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
            flexWrap: "wrap"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "28px" }}>🍎</span>
            <div>
              <strong style={{ color: "#991b1b", fontSize: "14px", display: "block" }}>
                Pomegranate Crop Detected ({form.farmerName || "Active Farm"})
              </strong>
              <p style={{ margin: "2px 0 0", color: "#b91c1c", fontSize: "12px" }}>
                You have access to our specialized ICAR deep learning model trained specifically on Pomegranate bacterial blight (Telya) and fruit spots.
              </p>
            </div>
          </div>
          <Link
            to="/pomegranate"
            style={{
              background: "#dc2626",
              color: "#ffffff",
              padding: "8px 18px",
              borderRadius: "10px",
              fontWeight: 700,
              fontSize: "12px",
              textDecoration: "none",
              boxShadow: "0 4px 12px rgba(220, 38, 38, 0.25)"
            }}
          >
            Open Pomegranate Specialist Portal →
          </Link>
        </div>
      )}

      {/* Tips Strip */}
      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e2ebe4",
          borderRadius: "14px",
          padding: "14px 20px",
          marginBottom: "24px",
          display: "flex",
          alignItems: "center",
          gap: "20px",
          fontSize: "12.5px",
          color: "#475569",
          flexWrap: "wrap"
        }}
      >
        <span style={{ fontWeight: 800, color: "#059669" }}>📸 SCANNING TIPS:</span>
        <span>1. Take close-up photos in bright, natural daylight</span>
        <span>2. Ensure the lesion or discolored spot is in sharp focus</span>
        <span>3. Avoid blurry images or high glare</span>
      </div>

      {/* Embedded Scanner Component */}
      <DiseaseScanner />
    </div>
  );
}
