import { useState } from "react";
import { NavLink, Outlet, useLocation, Link } from "react-router-dom";
import { useFarm } from "../context/FarmContext";
import "./Layout.css";

const PAGE_TITLES = {
  "/": { section: "Overview", title: "Executive Field Dashboard" },
  "/diagnostics": { section: "Satellite & Soil", title: "Farm Setup & Diagnostics" },
  "/crop-doctor": { section: "AI Pathology", title: "Crop Doctor & Disease Scanner" },
  "/pomegranate": { section: "Specialist", title: "Pomegranate AI Portal" },
  "/mandi-rates": { section: "Markets", title: "Live APMC Mandi Rates" },
  "/advisory": { section: "Agronomy", title: "Official Advisory Dossier" },
  "/history": { section: "Temporal Analytics", title: "Field Health & Weather History" }
};

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { form, farmHealth, weatherData, message, setMessage, theme, toggleTheme } = useFarm();

  const currentMeta = PAGE_TITLES[location.pathname] || {
    section: "Platform",
    title: "AGROBRIDGE Intelligence"
  };

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="agro-shell">
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="sidebar-backdrop"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* ── SIDEBAR ── */}
      <aside className={`agro-sidebar ${sidebarOpen ? "open" : ""}`}>
        {/* Brand Header */}
        <div className="agro-brand">
          <div className="brand-icon-box">🌿</div>
          <div className="brand-text">
            <h1>AGROBRIDGE</h1>
            <span>Smart Farm Intelligence</span>
          </div>
        </div>

        {/* Active Farm Mini-Widget */}
        <Link
          to="/diagnostics"
          className="sidebar-farm-badge"
          style={{ textDecoration: "none" }}
          onClick={closeSidebar}
          title="Click to view or edit farm configuration"
        >
          <div className="farm-badge-header">
            <span className="farm-badge-status">Sentinel-2 Live</span>
            <span style={{ fontSize: "11px", color: "var(--brand-accent)" }}>⚙️ Edit</span>
          </div>
          <div className="farm-badge-name">
            {form.farmerName ? `${form.farmerName}'s Farm` : "Active Farm"}
          </div>
          <div className="farm-badge-meta">
            <span>📍 {form.village || form.taluk || "Mandya"}, {form.state || "KA"}</span>
            <span>•</span>
            <span>🌾 {form.crop || "Tomato"} ({form.area || "2.5"} ac)</span>
          </div>
          <div className="farm-badge-score">
            <span>Health Index</span>
            <span className="score-chip">
              {farmHealth?.score ? `${farmHealth.score}/100` : "82/100"} ({farmHealth?.status || "GOOD"})
            </span>
          </div>
        </Link>

        {/* Navigation - Section 1: Farm Intelligence */}
        <div className="sidebar-group-title">Farm Core</div>
        <nav className="agro-nav-list" aria-label="Farm Intelligence Navigation">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `agro-nav-link ${isActive ? "active" : ""}`}
            onClick={closeSidebar}
          >
            <span className="nav-link-icon">📊</span>
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/diagnostics"
            className={({ isActive }) => `agro-nav-link ${isActive ? "active" : ""}`}
            onClick={closeSidebar}
          >
            <span className="nav-link-icon">🛰️</span>
            <span>Farm Setup &amp; Satellite</span>
            <span className="nav-link-badge">RADAR</span>
          </NavLink>

          <NavLink
            to="/crop-doctor"
            className={({ isActive }) => `agro-nav-link ${isActive ? "active" : ""}`}
            onClick={closeSidebar}
          >
            <span className="nav-link-icon">🔬</span>
            <span>Crop Doctor AI</span>
            <span className="nav-link-badge">SCAN</span>
          </NavLink>

          <NavLink
            to="/pomegranate"
            className={({ isActive }) => `agro-nav-link ${isActive ? "active" : ""}`}
            onClick={closeSidebar}
          >
            <span className="nav-link-icon">🍎</span>
            <span>Pomegranate AI</span>
            <span className="nav-link-badge hot">ICAR</span>
          </NavLink>
        </nav>

        {/* Navigation - Section 2: Market & Reports */}
        <div className="sidebar-group-title">Markets &amp; Reports</div>
        <nav className="agro-nav-list" aria-label="Markets and Reports Navigation">
          <NavLink
            to="/mandi-rates"
            className={({ isActive }) => `agro-nav-link ${isActive ? "active" : ""}`}
            onClick={closeSidebar}
          >
            <span className="nav-link-icon">💰</span>
            <span>APMC Mandi Rates</span>
            <span className="nav-link-badge">LIVE</span>
          </NavLink>

          <NavLink
            to="/advisory"
            className={({ isActive }) => `agro-nav-link ${isActive ? "active" : ""}`}
            onClick={closeSidebar}
          >
            <span className="nav-link-icon">📄</span>
            <span>Advisory Dossier</span>
            <span className="nav-link-badge">PDF</span>
          </NavLink>

          <NavLink
            to="/history"
            className={({ isActive }) => `agro-nav-link ${isActive ? "active" : ""}`}
            onClick={closeSidebar}
          >
            <span className="nav-link-icon">🕘</span>
            <span>Field History &amp; Trends</span>
          </NavLink>
        </nav>

        {/* Safe Data Box */}
        <div className="sidebar-safe-box">
          <span className="safe-icon">🛡️</span>
          <div className="safe-text">
            <strong>Data Sovereignty</strong>
            <p>Your coordinates &amp; agronomic records are securely encrypted.</p>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="sidebar-brand-footer">
          <span>🌿 AGROBRIDGE AI</span>
          <span>v2.4 Pro</span>
        </div>
      </aside>

      {/* ── MAIN CONTENT AREA ── */}
      <div className="agro-content-area">
        {/* iOS-Standard Ambient Blur Glows for Glass Refraction */}
        <div className="ios-glow-orb glow-top-left" aria-hidden="true" />
        <div className="ios-glow-orb glow-top-right" aria-hidden="true" />
        <div className="ios-glow-orb glow-mid-center" aria-hidden="true" />

        {/* Sticky Header Topbar */}
        <header className="agro-topbar">
          <div className="topbar-left">
            <button
              type="button"
              className="mobile-menu-btn"
              onClick={() => setSidebarOpen((prev) => !prev)}
              aria-label="Toggle navigation menu"
            >
              ☰
            </button>
            <div className="breadcrumb-area">
              <span className="breadcrumb-root">{currentMeta.section}</span>
              <span className="breadcrumb-current">{currentMeta.title}</span>
            </div>
          </div>

          <div className="topbar-center">
            <Link
              to="/diagnostics"
              className="farm-pill-widget"
              title="Click to view farm details"
            >
              <span className="pill-dot" />
              <span>📍 {form.taluk || "Mandya"}, {form.state || "KA"} • {form.crop || "Tomato"} ({form.area || "2.5"} ac)</span>
            </Link>

            <div className="weather-pill-widget" title="Live farm temperature">
              <span>🌤️</span>
              <span>{weatherData?.weather?.temperature ?? 28}°C {form.taluk || "Farm"}</span>
            </div>
          </div>

          <div className="topbar-right">
            <button
              type="button"
              className="theme-toggle-btn"
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Switch to daylight mode" : "Switch to dark glass mode"}
              title={theme === "dark" ? "Switch to daylight mode" : "Switch to dark glass mode"}
            >
              <span className="theme-toggle-icon">{theme === "dark" ? "☀️" : "🌙"}</span>
              <span className="theme-toggle-text">{theme === "dark" ? "Light" : "Dark"}</span>
            </button>

            <button
              type="button"
              className="topbar-notify-btn"
              onClick={() => setMessage("All field monitors active. No high-risk warnings.")}
              aria-label="Notifications"
              title="System Alerts"
            >
              🔔
              <span className="notify-badge" />
            </button>

            <div className="user-profile-badge">
              <div className="user-avatar">👨‍🌾</div>
              <div className="user-info">
                <span className="user-role">Verified Farmer</span>
                <span className="user-name">{form.farmerName || "Ravi Kumar"}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Body */}
        <main className="agro-main-wrapper">
          {message && (
            <div className="agro-status-banner">
              <span>{message}</span>
              <button
                type="button"
                className="status-banner-close"
                onClick={() => setMessage("")}
                aria-label="Dismiss notification"
              >
                ×
              </button>
            </div>
          )}

          <Outlet />
        </main>

        {/* Global Footer */}
        <footer className="agro-footer">
          <div className="footer-brand">
            <span>🌿 AGROBRIDGE AI</span>
            <span>• Empowering Climate-Resilient Agriculture</span>
          </div>
          <div className="footer-links">
            <Link to="/diagnostics">Farm Setup</Link>
            <Link to="/crop-doctor">Crop Doctor</Link>
            <Link to="/pomegranate">Pomegranate AI</Link>
            <Link to="/mandi-rates">Mandi Prices</Link>
            <Link to="/advisory">Advisory PDF</Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
