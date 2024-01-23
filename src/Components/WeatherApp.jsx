import './WeatherApp.css';
import { useState, useEffect } from 'react';
// TODO Add Error Message Using the `toast` function
import { toast } from 'react-toastify';
import { FaSearch } from 'react-icons/fa';
import constants from '../config/constants';

import humidityIcon from '../assets/humidity.png';
import clearIcon from '../assets/clear.png';
import cloudIcon from '../assets/cloud.png';
import drizzleIcon from '../assets/drizzle.png';
import rainIcon from '../assets/rain.png';
import snowIcon from '../assets/snow.png';
import windIcon from '../assets/wind.png';

const WeatherApp = () => {
  // Based On Error We can show some ErrorMessage Not Using Now
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState('');
  const [weatherIcon, setWeatherIcon] = useState(cloudIcon);
  const [cityName, setCityName] = useState('');
  const [humidity, setHumidity] = useState('humidity');
  const [wind, setWind] = useState('wind');
  const [temperature, setTemperature] = useState('temperature');
  const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
  const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_GEO_CODING_API;
  const WEATHER_BASE_URL = constants.openWeatherURL;
  const GEO_CODING_URL = constants.googleGeoCodingURL;

  useEffect(() => {
    console.log(`Inside useEffect`);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { coords } = position;
          const { longitude: lon, latitude: lat } = coords;

          getCurrentCityName({ longitude: lon, latitude: lat });
          getWeatherDataFromCoords({ lon, lat });
        },
        (err) => {
          setError(`Geolocation error: ${err.message}`);
          // TODO Error Message
        }
      );
    } else {
      setError('Geolocation is not supported by your browser');
      toast.error('Geolocation is not supported by your browser', errorParam);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getCurrentCityName = async ({ longitude, latitude }) => {
    try {
      const queryParams = new URLSearchParams({
        latlng: `${latitude},${longitude}`,
        key: GOOGLE_API_KEY,
      }).toString();

      const url = `${GEO_CODING_URL}?${queryParams}`;
      const response = await fetch(url);

      if (!response.ok) {
        return;
        // TODO : Error Message
      }

      const responseJson = await response.json();
      setCityName(responseJson.plus_code?.compound_code);
    } catch (error) {
      console.error(error);
      setError("Couldn't get the current city name");
    }
  };

  // eslint-disable-next-line no-unused-vars
  const getWeatherDataFromCoords = async ({ lon, lat }) => {
    const queryParams = {
      lon,
      lat,
      appid: WEATHER_API_KEY, // + '123', // :REMOVE  + "123":
    };
    const queryString = new URLSearchParams(queryParams).toString();
    const url = `${WEATHER_BASE_URL}?${queryString}`;
    const response = await fetch(url);

    if (!response.ok) {
      return;
      // TODO Error Message
    }

    const responseJson = await response.json();
    setUIIconsAndData(responseJson);
  };

  const getLatLongAndWeatherDataFromCityInput = async (e) => {
    e.preventDefault();
    try {
      const queryParams = new URLSearchParams({
        address: cityName,
        key: GOOGLE_API_KEY,
      }).toString();

      const response = await fetch(`${GEO_CODING_URL}?${queryParams}`);

      if (!response.ok) {
        setError('Geocoding API request failed');
        return;
      }

      const responseJson = await response.json();

      // eslint-disable-next-line no-unsafe-optional-chaining
      const { lat, lng } = responseJson?.results[0]?.geometry?.location;
      getWeatherDataFromCoords({ lat, lon: lng });
    } catch (error) {
      console.error('Error making Geocoding API request', error);

      setError('Error making Geocoding API request');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };

  // Directly Fetch Weather data with city name :UNUSED:
  // eslint-disable-next-line no-unused-vars
  const search = async () => {
    const url = `${
      import.meta.env.VITE_WEATHER_URL
    }?q=${cityName}&appid=${WEATHER_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();
    setHumidity(data.main.humidity + ' %');
    setTemperature(Math.floor(data.main.temp) + ' °C');
    setWind(Math.floor(data.wind.speed) + ' km/h');

    setUIIconsAndData(data);
  };

  const setUIIconsAndData = (data) => {
    setHumidity(data.main.humidity + ' %');
    setTemperature(Math.floor(data.main.temp) + ' °C');
    setWind(Math.floor(data.wind.speed) + ' km/h');

    if (data.weather[0].icon === '01d' || data.weather[0].icon === '50n') {
      setWeatherIcon(clearIcon);
    } else if (
      data.weather[0].icon === '02d' ||
      data.weather[0].icon === '02n'
    ) {
      setWeatherIcon(cloudIcon);
    } else if (
      data.weather[0].icon === '03d' ||
      data.weather[0].icon === '03n'
    ) {
      setWeatherIcon(drizzleIcon);
    } else if (
      data.weather[0].icon === '04d' ||
      data.weather[0].icon === '04n'
    ) {
      setWeatherIcon(drizzleIcon);
    } else if (
      data.weather[0].icon === '09d' ||
      data.weather[0].icon === '09n'
    ) {
      setWeatherIcon(rainIcon);
    } else if (
      data.weather[0].icon === '10d' ||
      data.weather[0].icon === '10n'
    ) {
      setWeatherIcon(rainIcon);
    } else if (
      data.weather[0].icon === '13d' ||
      data.weather[0].icon === '13n'
    ) {
      setWeatherIcon(snowIcon);
    } else {
      setWeatherIcon(clearIcon);
    }
  };

  const handleCityChange = (e) => {
    if (e.target.value === '') {
      setError('');
      setHumidity('');
      setTemperature('');
      setWind('');
      setWeatherIcon(cloudIcon);
    }

    setCityName(e.target.value);
  };

  return (
    <div className='container'>
      <div className='top-bar'>
        <form onSubmit={getLatLongAndWeatherDataFromCityInput}>
          <div className='citySearchForm'>
            <input
              type='text'
              className='cityInput'
              value={cityName}
              onChange={handleCityChange}
              placeholder='Search any city'
            />

            <button type='submit' className='search-icon'>
              {/* <img src={searchIcon} /> */}
              <FaSearch color='#000' /> Search
            </button>
          </div>
        </form>
      </div>
      <div className='weather-image'>
        <img src={weatherIcon} alt='' className='cloud' />
      </div>
      <div>{temperature}</div>
      <div>{cityName}</div>
      <div className='data-container'>
        <div className='element'>
          <img src={humidityIcon} alt='' className='icon' />
          <div className='data'>
            <div>{humidity}</div>
            <div className='text'>Humidity</div>
          </div>
        </div>

        <div className='element'>
          <img src={windIcon} alt='' className='icon' />
          <div className='data'>
            <div>{wind}</div>
            <div className='text'>Wind speed</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherApp;
