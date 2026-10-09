import { useEffect, useMemo, useState } from "react";
import "./FarmHealthHistory.css";

const API_BASE = "https://agrobridge-backend-gjbk.onrender.com";
const DAYS = [0, 7, 14, 30, 60, 90, 180, 365];

function formatDate(value) {
  if (!value) return "Unavailable";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function trendLabel(change) {
  if (!Number.isFinite(change)) return "Insufficient history";
  if (change >= 0.05) return "Improving";
  if (change <= -0.05) return "Declining";
  return "Stable";
}

export default function FarmHealthHistory({ latitude, longitude, analysisDone }) {
  const [observations, setObservations] = useState([]);
  const [availableCount, setAvailableCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadHistory = async () => {
    const lat = Number(latitude);
    const lng = Number(longitude);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

    setLoading(true);
    setError("");
    try {
      let data;
      let lastError;
      for (let attempt = 1; attempt <= 2; attempt += 1) {
        try {
          const response = await fetch(`${API_BASE}/api/farm/history`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ latitude: lat, longitude: lng, days: DAYS })
          });
          data = await response.json();
          if (!response.ok || data.success === false) {
            throw new Error(data.message || "Farm history is unavailable.");
          }
          break;
        } catch (err) {
          lastError = err;
          if (attempt < 2) await new Promise((resolve) => setTimeout(resolve, 1200));
        }
      }
      if (!data) throw lastError || new Error("Farm history is unavailable.");
      setAvailableCount(Number(data.availableObservations) || 0);
      setObservations((data.observations || []).filter((item) => Number.isFinite(Number(item.ndvi))));
    } catch (err) {
      setObservations([]);
      setError(err.message || "Farm history could not be loaded.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (analysisDone) loadHistory();
    else setObservations([]);
  }, [analysisDone, latitude, longitude]);

  const chart = useMemo(() => {
    const ordered = [...observations].sort((a, b) => Number(b.daysAgo) - Number(a.daysAgo));
    if (!ordered.length) return null;

    const values = ordered.map((item) => Number(item.ndvi));
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = Math.max(max - min, 0.08);
    const width = 720;
    const height = 220;
    const padX = 32;
    const padY = 28;
    const points = ordered.map((item, index) => {
      const x = ordered.length === 1 ? width / 2 : padX + (index / (ordered.length - 1)) * (width - padX * 2);
      const y = height - padY - ((Number(item.ndvi) - (min - range * 0.1)) / (range * 1.2)) * (height - padY * 2);
      return { ...item, x, y, value: Number(item.ndvi) };
    });
    const path = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(" ");
    return { points, path, min, max };
  }, [observations]);

  const latest = observations.length
    ? observations.reduce((best, item) => Number(item.daysAgo) < Number(best.daysAgo) ? item : best, observations[0])
    : null;
  const oldest = observations.length
    ? observations.reduce((best, item) => Number(item.daysAgo) > Number(best.daysAgo) ? item : best, observations[0])
    : null;
  const change = latest && oldest ? Number(latest.ndvi) - Number(oldest.ndvi) : null;

  return (
    <section className="farm-history" id="farm-health-history">
      <div className="history-head">
        <div>
          <span className="history-kicker">FARM HEALTH HISTORY</span>
          <h2>Vegetation trend over time</h2>
          <p>Real Sentinel-2 observations closest to the selected historical dates.</p>
        </div>
        <button type="button" onClick={loadHistory} disabled={loading || !analysisDone}>
          {loading ? "Loading..." : "Refresh History ↻"}
        </button>
      </div>

      {!analysisDone && (
        <div className="history-empty">Run <strong>Analyze My Farm</strong> to load the real satellite health timeline.</div>
      )}

      {analysisDone && loading && (
        <div className="history-loading"><span>🛰️</span> Fetching historical Sentinel-2 observations...</div>
      )}

      {analysisDone && !loading && error && (
        <div className="history-error">⚠️ {error} <button type="button" onClick={loadHistory}>Retry</button></div>
      )}

      {analysisDone && !loading && !error && chart && (
        <>
          <div className="history-summary">
            <div><span>Latest NDVI</span><strong>{Number(latest.ndvi).toFixed(2)}</strong><small>{formatDate(latest.observedDate)}</small></div>
            <div><span>Change vs oldest</span><strong className={change >= 0.05 ? "positive" : change <= -0.05 ? "negative" : ""}>{change >= 0 ? "+" : ""}{change.toFixed(2)}</strong><small>{trendLabel(change)}</small></div>
            <div><span>Observations</span><strong>{observations.length}</strong><small>{availableCount ? `${availableCount} of ${DAYS.length} dates available` : "within requested timeline"}</small></div>
          </div>

          <div className="history-chart-card">
            <div className="chart-meta"><span>NDVI</span><small>{chart.min.toFixed(2)} — {chart.max.toFixed(2)}</small></div>
            <svg viewBox="0 0 720 220" role="img" aria-label="Historical NDVI trend chart">
              <line x1="32" y1="28" x2="32" y2="192" className="chart-axis" />
              <line x1="32" y1="192" x2="688" y2="192" className="chart-axis" />
              <path d={chart.path} className="chart-line" />
              {chart.points.map((point) => (
                <g key={`${point.daysAgo}-${point.observedDate}`}>
                  <circle cx={point.x} cy={point.y} r="5" className="chart-point" />
                  <text x={point.x} y="211" textAnchor="middle" className="chart-label">{point.daysAgo === 0 ? "Now" : `${point.daysAgo}d`}</text>
                  <title>{`${point.value.toFixed(2)} NDVI • ${formatDate(point.observedDate)}`}</title>
                </g>
              ))}
            </svg>
          </div>

          <div className="history-observations">
            {observations.map((item) => (
              <div className="history-observation" key={`${item.daysAgo}-${item.observedDate}`}>
                <span>🛰️</span>
                <div><strong>{item.daysAgo === 0 ? "Latest" : `${item.daysAgo} days ago`}</strong><small>{formatDate(item.observedDate)}</small></div>
                <b>{Number(item.ndvi).toFixed(2)}</b>
              </div>
            ))}
          </div>

          <div className="history-note">ⓘ NDVI is a vegetation signal, not a diagnosis. Changes should be verified in the field and interpreted with crop stage, weather, soil and other farm evidence.</div>
        </>
      )}
    </section>
  );
}
