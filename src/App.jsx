import { useState, useEffect } from 'react'

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);

  async function handleSearch() {
    if (!city) return;

    try {
      const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`);
      const geoData = await geoResponse.json();
      if (!geoData.results) {
        alert("City not found");
        return;
      }
      const {latitude, longitude, name} = geoData.results[0];
      const weatherResponse = await fetch (
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
      );
      const weatherData = await weatherResponse.json();

      setWeather({
        city: name,
        temperature: weatherData.current_weather.temperature,
        windspeed: weatherData.current_weather.windspeed
      });

    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  }

  return (

      <div className = "container">

        <h1>Weather App</h1>

        <input
          type="text"
          placeholder="Enter city..."
          value = {city}
          onChange = {(e) => setCity(e.target.value)}
        />

        <button onClick={handleSearch}>Search</button>

        <div>
          {weather && (
            <div>
              <h2>{weather.city}</h2>
              <p>Temperature: {weather.temperature}C</p>
              <p>Wind Speed: {weather.windspeed} km/h</p>
            </div>
          )}
        </div>

      </div>
  )
}

export default App
