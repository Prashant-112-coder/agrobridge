import { useEffect, useMemo, useState } from "react";

const API_BASE = "https://agrobridge-backend-gjbk.onrender.com";

export default function DecisionRadar({ form, response, soilResult, weatherData }) {
  const [loading, setLoading] = useState(false);
  const [decision, setDecision] = useState(null);
  const [error, setError] = useState("");

  const inputs = useMemo(() => ({
    crop: form?.crop,
    cropStage: form?.cropStage,
    irrigation: form?.irrigation,
    ndvi: response?.satellite?.ndvi,
    soilPH: soilResult?.soil?.ph,
    temperature: weatherData?.weather?.temperature,
    humidity: weatherData?.weather?.humidity,
    precipitation: weatherData?.weather?.precipitation,
    windSpeed: weatherData?.weather?.windSpeed,
    forecast: weatherData?.weather?.forecast || []
  }), [form, response, soilResult, weatherData]);

  const analyzeDecision = async () => {
    if (!response || !weatherData || !soilResult) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/decision`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputs)
      });
      const data = await res.json();
      if (!res.ok || data.success === false) throw new Error(data.message || "Decision analysis failed");
      setDecision(data);
    } catch (err) {
      setDecision(null);
      setError(err.message || "Decision analysis failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!response || !weatherData || !soilResult) {
      setDecision(null);
      return;
    }
    analyzeDecision();
  }, [response, weatherData, soilResult, form?.crop, form?.cropStage, form?.irrigation]);

  const levelClass = decision?.risk?.level?.toLowerCase().replaceAll(" ", "-") || "idle";
  const hasInputs = Boolean(response && weatherData && soilResult);

  return (
    <section className="decision-radar" id="farm-risk-radar">
      <div className="decision-head">
        <div>
          <span className="decision-kicker">AI DECISION LAYER</span>
          <h2>Farm Risk Radar</h2>
          <p>Turn your live satellite, soil and weather signals into explainable next actions.</p>
        </div>
        <span className="decision-badge">LIVE SIGNALS</span>
      </div>

      <div className="decision-grid">
        <div className="decision-score-card">
          <div className={`decision-score ${levelClass}`}>
            <strong>{decision ? decision.risk.score : "--"}</strong>
            <span>/ 100</span>
          </div>
          <div className="decision-score-copy">
            <span>Current farm risk</span>
            <strong>{loading ? "Analyzing..." : decision?.risk?.level || "Awaiting analysis"}</strong>
            <small>{decision?.crop || form?.crop || "Crop not selected"} · {decision?.cropStage || form?.cropStage || "Stage not selected"}</small>
          </div>
        </div>

        <div className="decision-signals">
          <div className="signal-title"><strong>Why?</strong><span>{decision?.risks?.length || 0} active signals</span></div>
          {decision?.risks?.length ? decision.risks.map((risk) => (
            <div className="signal-row" key={`${risk.type}-${risk.signal}`}>
              <span className={`signal-level ${risk.level.toLowerCase()}`}>{risk.level}</span>
              <div><strong>{risk.signal}</strong><small>{risk.reason}</small></div>
            </div>
          )) : <div className="empty-signal">{loading ? "Combining the latest farm measurements..." : hasInputs ? "No elevated risk signals were detected by the current rules." : "Run farm analysis first to unlock the real contributing signals."}</div>}
        </div>
      </div>

      <div className="decision-actions">
        <div className="actions-heading"><div><span>🎯</span><div><strong>What should I do?</strong><small>Prioritized actions based on the available live signals.</small></div></div><button type="button" onClick={analyzeDecision} disabled={loading || !hasInputs}>{loading ? "Analyzing..." : "Refresh Risk Radar →"}</button></div>
        {decision?.actions?.length ? decision.actions.map((action) => (
          <div className="action-row" key={`${action.priority}-${action.title}`}>
            <span>{action.priority}</span><div><strong>{action.title}</strong><p>{action.detail}</p></div>
          </div>
        )) : <div className="action-placeholder">{loading ? "Generating prioritized actions..." : "Recommendations will appear here after live farm analysis."}</div>}
      </div>

      {decision?.summary && <div className="decision-summary">💡 <span>{decision.summary}</span></div>}
      {error && <div className="decision-error">⚠️ {error} <button type="button" onClick={analyzeDecision} disabled={loading || !hasInputs}>Retry</button></div>}
    </section>
  );
}
