import "./WeatherForecast.css";

export default function WeatherForecast({ weatherData }) {
  const forecast = weatherData?.weather?.forecast || [];
  if (!forecast.length) return null;
  return <section className="weather-forecast" id="weather-forecast">
    <div className="forecast-head"><div><span>WEATHER OUTLOOK</span><h2>Next 3 days</h2><p>Use the forecast as an input to irrigation and field-operation decisions.</p></div><strong>LIVE FORECAST</strong></div>
    <div className="forecast-grid">{forecast.map((day) => <article key={day.date} className="forecast-card">
      <span>{new Date(day.date).toLocaleDateString("en-IN",{weekday:"short"})}</span>
      <strong>{day.maxTemperature ?? "--"}° / {day.minTemperature ?? "--"}°C</strong>
      <div>🌧️ {day.precipitation ?? 0} mm</div><small>Rain probability: {day.precipitationProbability ?? "--"}%</small>
    </article>)}</div>
    <div className="forecast-note">ⓘ Forecasts can change. Recheck conditions before making time-sensitive farm decisions.</div>
  </section>;
}