// src/Weather.js
import React, { useState, useCallback } from 'react';
import axios from 'axios';
import debounce from 'lodash.debounce';

const Weather = React.memo(() => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);

  const fetchWeather = async (cityName) => {
    try {
      const response = await axios.get(
        `http://api.weatherstack.com/current`, {
          params: {
            query: cityName,
            access_key: 'd8cc251e9fc0d96050267779c2078466'
          }
        }
      );
      console.log('API response:', response.data);
      setWeather(response.data);
      setError(null);
    } catch (err) {
      console.error('API request failed:', err);
      setError('City not found');
      setWeather(null);
    }
  };

  const debouncedFetchWeather = useCallback(debounce(fetchWeather, 500), []);

  const handleChange = (e) => {
    const value = e.target.value;
    setCity(value);
    console.log(`City input changed to: ${value}`);
    if (value.trim()) {
      debouncedFetchWeather(value.trim());
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`Form submitted with city: ${city}`);
    if (city.trim()) {
      fetchWeather(city.trim());
    } else {
      setError('Please enter a city name');
      setWeather(null);
    }
  };

  return (
    <div>
      <h1>Weather App</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter city"
          value={city}
          onChange={handleChange}
        />
        <button type="submit">Get Weather</button>
      </form>
      {error && <p>{error}</p>}
      {weather && weather.current && (
        <div>
          <h2>Weather in {city}</h2>
          <p>Description: {weather.current.weather_descriptions[0]}</p>
          <p>Temperature: {weather.current.temperature}°C</p>
          <p>Humidity: {weather.current.humidity}%</p>
          <p>Wind Speed: {weather.current.wind_speed} km/h</p>
          <p>Observation Time: {weather.current.observation_time}</p>
          <p>Is Day: {weather.current.is_day}</p>
          <img src={weather.current.weather_icons[0]} alt="weather icon" />
        </div>
      )}
    </div>
  );
});

export default Weather;
