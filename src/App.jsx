import { useState, useEffect } from 'react'

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch() {
    setLoading(true);
    setError("");
    if (!city) return;

    try {
      const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`);
      const geoData = await geoResponse.json();
      if (!geoData.results) {
        setError("City not found");
        return;
      }
      const {latitude, longitude, name, country} = geoData.results[0];
      const weatherResponse = await fetch (
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
      );
      const weatherData = await weatherResponse.json();

      setWeather({
        city: name,
        country: country,
        temperature: weatherData.current_weather.temperature,
        windspeed: weatherData.current_weather.windspeed,
        winddirection: weatherData.current_weather.winddirection,
        weathercode: weatherData.current_weather.weathercode
      });

      setCity("");
      setLoading(false);

    } catch (error) {
      console.error(error);
      setError("Something went wrong");
      setLoading(false);
    }
  }

  function getWeatherBackground(code) {
    if (code === 0) return "sunny";
    if (code <= 3) return "cloudy";
    if (code < 70) return "rainy";
    if (code < 80) return "snowy";

    return "default";
  }

  function getWeatherEmoji(code) {
    if (code === 0) return "☀️";
    if (code < 3) return "⛅";
    if (code < 50) return "☁️";
    if (code < 70) return "🌧️";
    if (code < 80) return "❄️";

    return "🌦️";
  }

  return (

      <div className = {`container ${weather ?  getWeatherBackground(weather.weathercode) : ""}`}>

        <h1>Weather App</h1>

        <div className="search-bar">

          <input
            type="text"
            placeholder="Enter city..."
            value = {city}
            onChange = {(e) => setCity(e.target.value)}
            onKeyDown = {(e) => {
              if(e.key === "Enter") {
                handleSearch();
              }
            }}
            autoFocus
          />

          <button onClick={handleSearch}>Search</button>

        </div>

        {loading && <p>Loading...</p>}

        {error && (
          <p className = "error-message">{error}</p>
        )}

        <div>
          {weather && (
            <div className = "weather-card">
              <h2>{weather.city}, {weather.country}</h2>
              <div className = "weather-main">

                <div className = "weather-icon">
                  {getWeatherEmoji(weather.weathercode)}
                </div>

                <div className = "temperature">
                  {weather.temperature}°C
                </div>

              </div>

              <div className = "weather-details">
                <p>Wind Speed: {weather.windspeed} km/h</p>
                <p>Wind Direction: {weather.winddirection}°</p>
              </div>
            </div>
          )}
        </div>

      </div>
  )
}

export default App
