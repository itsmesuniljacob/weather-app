// src/Weather.js
import React, { useState, useCallback } from 'react';
import axios from 'axios';
import debounce from 'lodash.debounce';
import {
  Container,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Switch,
  FormControlLabel,
} from '@mui/material';

const Weather = React.memo(() => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isCelsius, setIsCelsius] = useState(true);

  const fetchWeather = async (cityName) => {
    setLoading(true);
    try {
      // const unit = isCelsius ? 'metric' : 'imperial';
      const response = await axios.get(
        `http://api.weatherstack.com/current`, {
          params: {
            query: cityName,
            access_key: 'redacted'
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
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchWeather = useCallback(debounce(fetchWeather, 500), [isCelsius]);

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

  const handleToggle = () => {
    setIsCelsius(!isCelsius);
    if (city.trim()) {
      fetchWeather(city.trim());
    }
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: '2rem' }}>
      <Typography variant="h4" gutterBottom>
        Weather App
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Enter city"
          variant="outlined"
          value={city}
          onChange={handleChange}
          margin="normal"
        />
        <FormControlLabel
          control={
            <Switch
              checked={isCelsius}
              onChange={handleToggle}
              name="temperatureToggle"
              color="primary"
            />
          }
          label={isCelsius ? "Celsius" : "Fahrenheit"}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
          sx={{
            borderRadius: '20px',
            mt: 2,
            transition: 'background-color 0.3s',
            '&:hover': {
              backgroundColor: '#0059b3',
            }
          }}
        >
          {loading ? <CircularProgress size={24} /> : 'Get Weather'}
        </Button>
      </form>
      {error && (
        <Alert severity="error" style={{ marginTop: '1rem' }}>
          {error}
        </Alert>
      )}
      {weather && weather.current && (
        <Card style={{ marginTop: '2rem', borderRadius: '15px' }}>
          <CardContent>
            <Typography variant="h5">
              Weather in {weather.location.name}
            </Typography>
            <Typography>
              Description: {weather.current.weather_descriptions[0]}
            </Typography>
            <Typography>
              Temperature: {weather.current.temperature}°{isCelsius ? 'C' : 'F'}
            </Typography>
            <Typography>
              Humidity: {weather.current.humidity}%
            </Typography>
            <Typography>
              Wind Speed: {weather.current.wind_speed} {isCelsius ? 'm/s' : 'mph'}
            </Typography>
          </CardContent>
        </Card>
      )}
    </Container>
  );
});

export default Weather;
