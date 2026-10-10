import { useEffect } from "react";
import { Link } from "react-router-dom";
import DiseaseScanner from "../components/DiseaseScanner";
import "./PomegranateAI.css";

const API_BASE = "https://agrobridge-backend-gjbk.onrender.com";

const DISEASE_CLASSES = [
  {
    name: "Healthy",
    icon: "✅",
    color: "#22c55e",
    bg: "#dcfce7",
    desc: "No disease detected — fruit is in optimal condition",
  },
  {
    name: "Anthracnose",
    icon: "🔴",
    color: "#ef4444",
    bg: "#fee2e2",
    desc: "Colletotrichum fungal infection causing dark sunken lesions",
  },
  {
    name: "Bacterial Blight",
    icon: "⚠️",
    color: "#dc2626",
    bg: "#fecaca",
    desc: "Xanthomonas (Telya) causing water-soaked oily spots",
  },
  {
    name: "Alternaria",
    icon: "🟠",
    color: "#f59e0b",
    bg: "#fef3c7",
    desc: "Alternaria black spot and internal heart rot",
  },
  {
    name: "Cercospora",
    icon: "🟤",
    color: "#92400e",
    bg: "#fde68a",
    desc: "Brown spots with grey centers on fruit rind",
  },
];

export default function PomegranateAI() {
  useEffect(() => {
    document.title = "Pomegranate Disease AI | AGROBRIDGE";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pom-page">
      {/* ── Pomegranate themed top bar ── */}
      <header className="pom-topbar">
        <div className="pom-topbar-inner">
          <Link to="/" className="pom-back-link">
            <span>←</span>
            <span>Dashboard</span>
          </Link>
          <div className="pom-brand">
            <span className="pom-brand-icon">🍎</span>
            <div>
              <strong>Pomegranate Disease AI</strong>
              <span>AGROBRIDGE Computer Vision Diagnostics</span>
            </div>
          </div>
          <div className="pom-topbar-badge">
            <span className="pom-pulse" />
            <span>AI ENGINE ACTIVE</span>
          </div>
        </div>
      </header>

      {/* ── Hero section ── */}
      <section className="pom-hero">
        <div className="pom-hero-bg" />
        <div className="pom-hero-content">
          <div className="pom-hero-text">
            <span className="pom-hero-kicker">
              POWERED BY EFFICIENTNET-B0 TRANSFER LEARNING
            </span>
            <h1>
              Instant Pomegranate
              <br />
              <span>Disease Identification</span>
            </h1>
            <p>
              Upload or capture a close-up photo of your pomegranate fruit. Our
              AI model trained on thousands of field images identifies 5 major
              disease conditions and delivers ICAR-aligned treatment protocols in
              seconds.
            </p>
            <div className="pom-hero-stats">
              <div className="pom-stat">
                <strong>5</strong>
                <span>Disease Classes</span>
              </div>
              <div className="pom-stat-divider" />
              <div className="pom-stat">
                <strong>0.55</strong>
                <span>Rejection Gate</span>
              </div>
              <div className="pom-stat-divider" />
              <div className="pom-stat">
                <strong>&lt;3s</strong>
                <span>Inference Time</span>
              </div>
            </div>
          </div>
          <div className="pom-hero-visual">
            <div className="pom-fruit-ring">
              <div className="pom-fruit-emoji">🍎</div>
              <div className="pom-orbit pom-orbit-1" />
              <div className="pom-orbit pom-orbit-2" />
              <div className="pom-orbit pom-orbit-3" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Disease classes overview ── */}
      <section className="pom-classes-section">
        <div className="pom-section-head">
          <span className="pom-section-kicker">DETECTABLE CONDITIONS</span>
          <h2>Disease Classes</h2>
          <p>
            Our model identifies these 5 pomegranate fruit conditions with
            high-confidence differential diagnosis
          </p>
        </div>
        <div className="pom-classes-grid">
          {DISEASE_CLASSES.map((cls) => (
            <div
              key={cls.name}
              className="pom-class-card"
              style={{ borderColor: cls.color + "40" }}
            >
              <div
                className="pom-class-icon"
                style={{ background: cls.bg }}
              >
                {cls.icon}
              </div>
              <strong>{cls.name}</strong>
              <span>{cls.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Main Scanner ── */}
      <section className="pom-scanner-section">
        <DiseaseScanner apiBase={API_BASE} />
      </section>

      {/* ── How it works ── */}
      <section className="pom-how-section">
        <div className="pom-section-head">
          <span className="pom-section-kicker">WORKFLOW</span>
          <h2>How It Works</h2>
        </div>
        <div className="pom-steps-row">
          <div className="pom-step-card">
            <div className="pom-step-num">1</div>
            <div className="pom-step-icon">📸</div>
            <strong>Capture</strong>
            <span>
              Take a clear, close-up photo of the pomegranate fruit in daylight.
              Focus on the affected area.
            </span>
          </div>
          <div className="pom-step-arrow">→</div>
          <div className="pom-step-card">
            <div className="pom-step-num">2</div>
            <div className="pom-step-icon">🧠</div>
            <strong>AI Analysis</strong>
            <span>
              EfficientNet-B0 processes the image through 224×224 preprocessing,
              softmax classification, and confidence gating.
            </span>
          </div>
          <div className="pom-step-arrow">→</div>
          <div className="pom-step-card">
            <div className="pom-step-num">3</div>
            <div className="pom-step-icon">💊</div>
            <strong>Treatment Plan</strong>
            <span>
              Receive immediate action steps, preventive measures, and
              agronomist consultation guidance per ICAR protocols.
            </span>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="pom-footer">
        <div className="pom-footer-inner">
          <div className="pom-footer-brand">
            <span>🍎</span>
            <div>
              <strong>AGROBRIDGE Pomegranate AI</strong>
              <span>Computer Vision Disease Diagnostics</span>
            </div>
          </div>
          <Link to="/" className="pom-footer-back">
            ← Back to Dashboard
          </Link>
        </div>
        <div className="pom-footer-disclaimer">
          🛡️ This is an AI-powered screening tool. For serious disease outbreaks
          (especially Bacterial Blight / Telya), always verify with your nearest
          Krishi Vigyan Kendra (KVK) or agricultural extension officer.
        </div>
      </footer>
    </div>
  );
}
