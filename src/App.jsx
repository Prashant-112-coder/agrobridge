import { useEffect, useState } from "react";
import "./App.css";

function App() {

  // ============================================================
  // APPLICATION STATE
  // ============================================================

  const [response, setResponse] = useState(null);

  // Soil source selected by farmer
  const [soilSource, setSoilSource] = useState("");

  // Location-based soil result
  const [soilResult, setSoilResult] = useState(null);
  const [soilLoading, setSoilLoading] = useState(false);

  // Weather information
  const [weatherData, setWeatherData] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);

  // Farm health calculation
  const [farmHealth, setFarmHealth] = useState(null);

  // Farmer's own soil-test data
  const [soilData, setSoilData] = useState({
    ph: "",
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    organicCarbon: "",
    soilType: "",
  });

  const [soilSaved, setSoilSaved] = useState(false);


  // ============================================================
  // TEST FARM LOCATION
  // For now we are using Ravi's farm as test data.
  // Later we will take this from the farmer.
  // ============================================================

  const FARM_LATITUDE = 12.5218;
  const FARM_LONGITUDE = 76.8951;
  const FARM_CROP = "Tomato";


  // ============================================================
  // FARM ANALYSIS
  // Sentinel-2 satellite → NDVI
  // ============================================================

  const testBackend = async () => {

    try {

      const res = await fetch(
        "http://localhost:5000/api/farm",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            latitude: FARM_LATITUDE,
            longitude: FARM_LONGITUDE,
            crop: FARM_CROP,
          }),
        }
      );

      const data = await res.json();

      console.log(
        "Backend response:",
        data
      );

      setResponse(data);

    } catch (error) {

      console.error(
        "Backend connection failed:",
        error
      );

      setResponse({
        error: "Backend connection failed"
      });

    }

  };


  // ============================================================
  // SAVE FARMER SOIL TEST
  // ============================================================

  const saveSoilData = () => {

    console.log(
      "Farmer soil data:",
      soilData
    );

    setSoilSaved(true);

  };


  // ============================================================
  // LOCATION-BASED SOIL
  // Backend → Earth Engine → OpenLandMap
  // ============================================================

  const getLocationSoil = async () => {

    try {

      setSoilLoading(true);

      const res = await fetch(
        "http://localhost:5000/api/soil",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            latitude: FARM_LATITUDE,
            longitude: FARM_LONGITUDE,
          }),
        }
      );

      const data = await res.json();

      console.log(
        "Soil API response:",
        data
      );

      if (data.success) {
        setSoilResult(data);
      }

    } catch (error) {

      console.error(
        "Soil API failed:",
        error
      );

    } finally {

      setSoilLoading(false);

    }

  };


  // ============================================================
  // WEATHER
  // Backend → Open-Meteo
  // ============================================================

  const getWeather = async () => {

    try {

      setWeatherLoading(true);

      const res = await fetch(
        "http://localhost:5000/api/weather",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            latitude: FARM_LATITUDE,
            longitude: FARM_LONGITUDE,
          }),
        }
      );

      const data = await res.json();

      console.log(
        "Weather API response:",
        data
      );

      if (data.success) {
        setWeatherData(data);
      }

    } catch (error) {

      console.error(
        "Weather API failed:",
        error
      );

    } finally {

      setWeatherLoading(false);

    }

  };


  // ============================================================
  // FARM HEALTH CALCULATION
  // Combines NDVI + soil pH + temperature
  // ============================================================

  const calculateFarmHealth = () => {

    if (
      !response ||
      !soilResult ||
      !weatherData
    ) {
      return;
    }

    const ndvi =
      response.satellite?.ndvi;

    const ph =
      soilResult.soil?.ph;

    const temperature =
      weatherData.weather?.temperature;


    if (
      ndvi === undefined ||
      ph === undefined ||
      temperature === undefined
    ) {
      return;
    }


    // -----------------------------
    // NDVI SCORE
    // -----------------------------

    let ndviScore;

    if (ndvi >= 0.6) {
      ndviScore = 100;
    } else if (ndvi >= 0.4) {
      ndviScore = 80;
    } else if (ndvi >= 0.2) {
      ndviScore = 60;
    } else if (ndvi >= 0.1) {
      ndviScore = 40;
    } else {
      ndviScore = 20;
    }


    // -----------------------------
    // SOIL pH SCORE
    // -----------------------------

    let soilScore;

    if (ph >= 6 && ph <= 7.5) {
      soilScore = 100;
    } else if (ph >= 5.5 && ph <= 8) {
      soilScore = 75;
    } else {
      soilScore = 50;
    }


    // -----------------------------
    // WEATHER SCORE
    // -----------------------------

    let weatherScore = 100;

    if (temperature > 35) {
      weatherScore = 40;
    } else if (temperature > 32) {
      weatherScore = 60;
    } else if (temperature > 30) {
      weatherScore = 80;
    }


    // -----------------------------
    // FINAL SCORE
    // -----------------------------

    const score = Math.round(
      ndviScore * 0.5 +
      soilScore * 0.3 +
      weatherScore * 0.2
    );


    let status = "GOOD";

    if (score < 50) {
      status = "HIGH RISK";
    } else if (score < 70) {
      status = "MODERATE";
    }


    setFarmHealth({
      score,
      status,
      ndvi,
      soilPH: ph,
      temperature
    });

  };


  // ============================================================
  // LOAD WEATHER WHEN PAGE OPENS
  // ============================================================

  useEffect(() => {

    getWeather();

  }, []);


  // ============================================================
  // RECALCULATE FARM HEALTH WHEN DATA CHANGES
  // ============================================================

  useEffect(() => {

    calculateFarmHealth();

  }, [
    response,
    soilResult,
    weatherData
  ]);


  // ============================================================
  // UI STARTS HERE
  // ============================================================

  return (

    <div className="app">


      {/* ======================================================
          NAVIGATION
      ====================================================== */}

      <header className="navbar">

        <div className="brand">

          <div className="brand-mark">
            A
          </div>

          <div>

            <div className="brand-name">
              AGROBRIDGE
            </div>

            <div className="brand-subtitle">
              AGRICULTURAL INTELLIGENCE
            </div>

          </div>

        </div>


        <div className="system-status">

          <span className="status-dot"></span>

          SYSTEM ONLINE

        </div>

      </header>


      {/* ======================================================
          MAIN DASHBOARD
      ====================================================== */}

      <main className="dashboard">


        {/* ====================================================
            HERO
        ==================================================== */}

        <section className="hero-section">

          <div>

            <p className="eyebrow">
              SMART FARM DIGITAL TWIN
            </p>

            <h1>
              Understand your
              <span> farm.</span>
            </h1>

            <p className="hero-description">

              Satellite intelligence, climate data and
              AI-powered agricultural insights — unified
              in one platform.

            </p>

          </div>


          <button
            type="button"
            className="analyze-button"
            onClick={testBackend}
          >

            Analyze My Farm

            <span>
              →
            </span>

          </button>

        </section>


        {/* ====================================================
            FARM INFORMATION
        ==================================================== */}

        <section className="farm-grid">


          {/* FARM CARD */}

          <div className="card farm-card">

            <div className="card-header">

              <span>
                MY FARM
              </span>

              <span className="card-number">
                01
              </span>

            </div>


            <div className="farm-location">

              <h2>
                Ravi's Farm
              </h2>

              <p>
                Mandya, Karnataka, India
              </p>

            </div>


            <div className="farm-details">

              <div>

                <span>
                  CROP
                </span>

                <strong>
                  Tomato
                </strong>

              </div>


              <div>

                <span>
                  AREA
                </span>

                <strong>
                  2.5 acres
                </strong>

              </div>


              <div>

                <span>
                  CROP AGE
                </span>

                <strong>
                  35 days
                </strong>

              </div>

            </div>

          </div>


          {/* SATELLITE CARD */}

          <div className="card satellite-card">

            <div className="card-header">

              <span>
                SATELLITE INTELLIGENCE
              </span>

              <span className="live-label">
                LIVE
              </span>

            </div>


            <div className="satellite-placeholder">

              <div className="map-grid"></div>

              <div className="farm-point">

                <span></span>

              </div>

              <div className="map-label">

                12.5218° N
                &nbsp;&nbsp;
                76.8951° E

              </div>

              <div className="map-overlay">

                SENTINEL-2

              </div>

            </div>

          </div>

        </section>


        {/* ====================================================
            FARM HEALTH
        ==================================================== */}

        <section className="section">

          <div className="section-title">

            <div>

              <p className="eyebrow">
                FIELD ANALYTICS
              </p>

              <h2>
                Farm Health
              </h2>

            </div>

            <span className="timestamp">
              LIVE ANALYSIS
            </span>

          </div>


          <div className="metrics">


            {/* FARM HEALTH SCORE */}

            <div className="metric-card">

              <span className="metric-label">
                FARM HEALTH
              </span>

              <strong>

                {farmHealth
                  ? farmHealth.score
                  : "--"
                }

              </strong>

              <small>
                / 100
              </small>

              <div className="metric-status good">

                {farmHealth
                  ? farmHealth.status
                  : "ANALYZING"
                }

              </div>

            </div>


            {/* NDVI */}

            <div className="metric-card">

              <span className="metric-label">
                NDVI
              </span>

              <strong>

                {farmHealth
                  ? farmHealth.ndvi.toFixed(2)
                  : "--"
                }

              </strong>

              <div className="metric-status good">
                SATELLITE
              </div>

            </div>


            {/* SOIL pH */}

            <div className="metric-card">

              <span className="metric-label">
                SOIL pH
              </span>

              <strong>

                {farmHealth
                  ? farmHealth.soilPH
                  : "--"
                }

              </strong>

              <div className="metric-status good">
                SOIL DATA
              </div>

            </div>


            {/* TEMPERATURE */}

            <div className="metric-card">

              <span className="metric-label">
                TEMPERATURE
              </span>

              <strong>

                {farmHealth
                  ? farmHealth.temperature
                  : "--"
                }

              </strong>

              <small>
                °C
              </small>

              <div className="metric-status moderate">
                WEATHER
              </div>

            </div>

          </div>


        </section>


        {/* ====================================================
            SOIL INTELLIGENCE
        ==================================================== */}

        <section className="section">

          <div className="section-title">

            <div>

              <p className="eyebrow">
                SOIL INTELLIGENCE
              </p>

              <h2>
                Tell us about your soil
              </h2>

            </div>

            <span className="timestamp">
              STEP 01
            </span>

          </div>


          <div className="soil-source-card">

            <p className="soil-question">
              Soil data source:
            </p>


            <div className="soil-options">


              {/* I HAVE A SOIL TEST */}

              <button
                type="button"

                className={`soil-option ${
                  soilSource === "test"
                    ? "selected"
                    : ""
                }`}

                onClick={() => {
                  setSoilSource("test");
                }}
              >

                <span className="radio-circle">

                  {soilSource === "test" && "✓"}

                </span>


                <div>

                  <strong>
                    I have a soil test
                  </strong>

                  <small>
                    Enter or upload your soil-test results
                  </small>

                </div>

              </button>


              {/* I DON'T HAVE A SOIL TEST */}

              <button
                type="button"

                className={`soil-option ${
                  soilSource === "none"
                    ? "selected"
                    : ""
                }`}

                onClick={() => {

                  setSoilSource("none");

                  getLocationSoil();

                }}
              >

                <span className="radio-circle">

                  {soilSource === "none" && "✓"}

                </span>


                <div>

                  <strong>
                    I don't have one
                  </strong>

                  <small>
                    Use available location-based soil data
                  </small>

                </div>

              </button>


              {/* I'M NOT SURE */}

              <button
                type="button"

                className={`soil-option ${
                  soilSource === "unsure"
                    ? "selected"
                    : ""
                }`}

                onClick={() => {

                  setSoilSource("unsure");

                }}
              >

                <span className="radio-circle">

                  {soilSource === "unsure" && "✓"}

                </span>


                <div>

                  <strong>
                    I'm not sure
                  </strong>

                  <small>
                    We'll help determine the available data
                  </small>

                </div>

              </button>


            </div>


            {/* ==================================================
                LOCATION SOIL RESULT
            ================================================== */}

            {soilSource === "none" && (

              <div className="soil-location-result">

                {soilLoading && (

                  <div className="soil-message">

                    🌍 Analyzing soil conditions
                    for your farm...

                  </div>

                )}


                {!soilLoading && soilResult && (

                  <>

                    <div className="soil-message">

                      ✓ Location-based soil analysis completed.

                      <br />

                      <small>

                        These are geospatial estimates,
                        not laboratory measurements.

                      </small>

                    </div>


                    <div className="soil-result-grid">

                      <div className="soil-result-card">

                        <span>
                          ESTIMATED SOIL pH
                        </span>

                        <strong>
                          {soilResult.soil.ph}
                        </strong>

                      </div>


                      <div className="soil-result-card">

                        <span>
                          ORGANIC CARBON
                        </span>

                        <strong>

                          {soilResult.soil.organicCarbon_g_per_kg}

                          <small>
                            {" "}g/kg
                          </small>

                        </strong>

                      </div>

                    </div>

                  </>

                )}

              </div>

            )}

            {/* ==================================================
                SOIL TEST FORM
            ================================================== */}

            {soilSource === "test" && (

              <div className="soil-test-form">

                <p className="eyebrow">
                  SOIL TEST RESULTS
                </p>

                <h3>
                  Enter your soil information
                </h3>

                <div className="soil-input-grid">

                  <div className="soil-input">

                    <label>
                      SOIL pH
                    </label>

                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="14"
                      placeholder="e.g. 6.5"

                      value={soilData.ph}

                      onChange={(e) =>
                        setSoilData({
                          ...soilData,
                          ph: e.target.value
                        })
                      }
                    />

                  </div>


                  <div className="soil-input">

                    <label>
                      NITROGEN
                    </label>

                    <input
                      type="text"
                      placeholder="e.g. Medium"

                      value={soilData.nitrogen}

                      onChange={(e) =>
                        setSoilData({
                          ...soilData,
                          nitrogen: e.target.value
                        })
                      }
                    />

                  </div>


                  <div className="soil-input">

                    <label>
                      PHOSPHORUS
                    </label>

                    <input
                      type="text"
                      placeholder="e.g. High"

                      value={soilData.phosphorus}

                      onChange={(e) =>
                        setSoilData({
                          ...soilData,
                          phosphorus: e.target.value
                        })
                      }
                    />

                  </div>


                  <div className="soil-input">

                    <label>
                      POTASSIUM
                    </label>

                    <input
                      type="text"
                      placeholder="e.g. Medium"

                      value={soilData.potassium}

                      onChange={(e) =>
                        setSoilData({
                          ...soilData,
                          potassium: e.target.value
                        })
                      }
                    />

                  </div>


                  <div className="soil-input">

                    <label>
                      ORGANIC CARBON (%)
                    </label>

                    <input
                      type="number"
                      step="0.1"
                      placeholder="e.g. 0.8"

                      value={soilData.organicCarbon}

                      onChange={(e) =>
                        setSoilData({
                          ...soilData,
                          organicCarbon: e.target.value
                        })
                      }
                    />

                  </div>


                  <div className="soil-input">

                    <label>
                      SOIL TYPE
                    </label>

                    <select
                      value={soilData.soilType}

                      onChange={(e) =>
                        setSoilData({
                          ...soilData,
                          soilType: e.target.value
                        })
                      }
                    >

                      <option
                        value=""
                        disabled
                      >
                        Select soil type
                      </option>

                      <option>
                        Black Soil
                      </option>

                      <option>
                        Red Soil
                      </option>

                      <option>
                        Alluvial Soil
                      </option>

                      <option>
                        Sandy Soil
                      </option>

                      <option>
                        Clay Soil
                      </option>

                      <option>
                        Loamy Soil
                      </option>

                      <option>
                        Other
                      </option>

                    </select>

                  </div>

                </div>


                <button
                  type="button"
                  className="save-soil-button"
                  onClick={saveSoilData}
                >

                  Save Soil Data →

                </button>


                {soilSaved && (

                  <div className="soil-message">

                    ✓ Soil information saved successfully.

                  </div>

                )}

              </div>

            )}


            {/* I'M NOT SURE */}

            {soilSource === "unsure" && (

              <div className="soil-message">

                💡 That's okay. AGROBRIDGE will guide you
                and use available data where possible.

              </div>

            )}

          </div>

        </section>
                {/* ====================================================
            WEATHER INTELLIGENCE
        ==================================================== */}

        <section className="section">

          <div className="section-title">

            <div>

              <p className="eyebrow">
                WEATHER INTELLIGENCE
              </p>

              <h2>
                Current Farm Weather
              </h2>

            </div>

            <span className="timestamp">

              {weatherLoading
                ? "UPDATING"
                : "LIVE"
              }

            </span>

          </div>


          <div className="metrics">


            {/* TEMPERATURE */}

            <div className="metric-card">

              <span className="metric-label">
                TEMPERATURE
              </span>

              <strong>

                {weatherData
                  ? weatherData.weather.temperature
                  : "--"
                }

              </strong>

              <small>
                °C
              </small>

              <div className="metric-status good">
                CURRENT
              </div>

            </div>


            {/* HUMIDITY */}

            <div className="metric-card">

              <span className="metric-label">
                HUMIDITY
              </span>

              <strong>

                {weatherData
                  ? weatherData.weather.humidity
                  : "--"
                }

              </strong>

              <small>
                %
              </small>

              <div className="metric-status moderate">
                CURRENT
              </div>

            </div>


            {/* PRECIPITATION */}

            <div className="metric-card">

              <span className="metric-label">
                PRECIPITATION
              </span>

              <strong>

                {weatherData
                  ? weatherData.weather.precipitation
                  : "--"
                }

              </strong>

              <small>
                mm
              </small>

              <div className="metric-status moderate">
                CURRENT
              </div>

            </div>


            {/* WIND SPEED */}

            <div className="metric-card">

              <span className="metric-label">
                WIND SPEED
              </span>

              <strong>

                {weatherData
                  ? weatherData.weather.windSpeed
                  : "--"
                }

              </strong>

              <small>
                km/h
              </small>

              <div className="metric-status moderate">
                CURRENT
              </div>

            </div>

          </div>

        </section>


        {/* ====================================================
            AGROGUIDE AI
        ==================================================== */}

        <section className="ai-card">

          <div className="ai-icon">
            ✦
          </div>


          <div className="ai-content">

            <p className="eyebrow">
              AGROGUIDE AI
            </p>

            <h2>
              Farm Intelligence
            </h2>

            <p>

              Your farm is being analyzed using
              satellite imagery, soil information
              and current weather conditions.

            </p>


            <button
              type="button"
              className="text-button"
            >

              View Recommendations →

            </button>

          </div>


          <div className="ai-score">

            <span>
              FARM HEALTH
            </span>

            <strong>

              {farmHealth
                ? farmHealth.score
                : "--"
              }

            </strong>

            <small>
              /100
            </small>

          </div>

        </section>


        {/* ====================================================
            BACKEND RESPONSE
            Useful while testing the system
        ==================================================== */}

        {response && (

          <section className="response-card">

            <p className="eyebrow">
              BACKEND RESPONSE
            </p>

            <pre>

              {JSON.stringify(
                response,
                null,
                2
              )}

            </pre>

          </section>

        )}

      </main>


      {/* ======================================================
          FOOTER
      ====================================================== */}

      <footer>

        <span>
          AGROBRIDGE AI
        </span>

        <span>
          CLIMATE-RESILIENT AGRICULTURE
        </span>

      </footer>


    </div>

  );

}


// ============================================================
// EXPORT APPLICATION
// ============================================================

export default App;