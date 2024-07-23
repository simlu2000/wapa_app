import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavBar from '../Components/NavBar';
import Footer from '../Components/Footer';
import SearchLocation from '../Components/SearchLocation';
import WindCharts from '../Components/Charts/WindCharts';
import TempCharts from '../Components/Charts/TempCharts';
import PressureCharts from '../Components/Charts/PressureCharts';
import Sunrise from '../Components/Charts/Sunrise';
import Sunset from '../Components/Charts/Sunset';
import Forecast from '../Components/Forecast';
import TemperatureMap from '../Components/Maps/TemperatureMap';
import PrecipitationMap from '../Components/Maps/PrecipitationMap';
import WindMap from '../Components/Maps/WindMap';
import PercentageBox from '../Components/PercentageBox';
import UserPlaces from '../Components/UserPlaces'; 

import '../Styles/style_weatherscreen.css';
import { Lottie } from 'lottie-react';
import 'leaflet/dist/leaflet.css';
import animationData from '../Animations/Animation - 1720385851643.json';

import { Api_Key_OpenWeather } from '../Utils/API_KEYS';

const WeatherScreen = () => {
    const [weatherData, setWeatherData] = useState(null);
    const [airPollutionData, setAirPollutionData] = useState(null);
    const [city, setCity] = useState('');
    const [location, setLocation] = useState({ latitude: null, longitude: null });
    const [forecastData, setForecastData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getUserLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    position => {
                        setLocation({
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude
                        });
                    },
                    error => {
                        console.error('Errore nel recupero posizione utente', error);
                    }
                );
            } else {
                console.error('Geolocalizzazione non consentita dal browser');
            }
        };
        getUserLocation();
    }, []);

    useEffect(() => {
        const fetchWeatherData = async () => {
            if (location.latitude && location.longitude) {
                try {
                    const weatherResponse = await axios.get(
                        `https://api.openweathermap.org/data/2.5/weather?lat=${location.latitude}&lon=${location.longitude}&appid=${Api_Key_OpenWeather}&units=metric`
                    );
                    setWeatherData(weatherResponse.data);
                    setCity(weatherResponse.data.name);

                    const airPollutionResponse = await axios.get(
                        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${location.latitude}&lon=${location.longitude}&appid=${Api_Key_OpenWeather}`
                    );
                    setAirPollutionData(airPollutionResponse.data.list[0].main);

                    const forecastResponse = await axios.get(
                        `https://api.openweathermap.org/data/2.5/forecast?lat=${location.latitude}&lon=${location.longitude}&appid=${Api_Key_OpenWeather}&units=metric`
                    );
                    setForecastData(forecastResponse.data.list);
                    setLoading(false);
                } catch (error) {
                    console.error("Error during fetching weather data", error);
                    setLoading(false);
                }
            }
        };
        fetchWeatherData();
    }, [location]);

    const fetchWeatherBySearchedLocation = async (location) => {
        try {
            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${Api_Key_OpenWeather}&units=metric`
            );
            setWeatherData(response.data);
            setCity(response.data.name);

            const forecastResponse = await axios.get(
                `https://api.openweathermap.org/data/2.5/forecast?lat=${response.data.coord.lat}&lon=${response.data.coord.lon}&appid=${Api_Key_OpenWeather}&units=metric`
            );
            setForecastData(forecastResponse.data.list);
        } catch (error) {
            console.error("Error. Location not found", error);
        }
    };

    const applyBackgroundGradient = (weatherMain) => {
        switch (weatherMain) {
            case 'Clear':
                return 'linear-gradient(to top, #fff1eb 0%, #ace0f9 100%)';
            case 'Clouds':
                return 'linear-gradient(-20deg, #616161 0%, #9bc5c3 100%)';
            case 'Rain':
                return 'linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%)';
            case 'Snow':
                return 'linear-gradient(to top, #e6e9f0 0%, #eef1f5 100%)';
            case 'Thunderstorm':
                return 'linear-gradient(to right, #f83600 0%, #f9d423 100%)';
            case 'Drizzle':
                return 'linear-gradient(to right, #4CA1AF, #C4E0E5)';
            case 'Fog':
            case 'Mist':
            case 'Haze':
                return 'linear-gradient(to right, #757F9A, #D7DDE8)';
            default:
                return 'linear-gradient(to right, #83a4d4, #b6fbff)';
        }
    };

    const calculateDewPoint = (temp, hum) => {
        const x = 17.27;
        const y = 237.7;
        const alpha = (x * temp) / (y + temp) + Math.log(hum / 100);
        const dewPoint = (y * alpha) / (x - alpha);
        return dewPoint;
    };

    return (
        <>
            <section
                id="weather-intro"
                className="container-data"
                style={{
                    display: `flex`,
                    flexDirection: `column`,
                    alignItems: `center`,
                    justifyContent: `center`,
                    transition: `background-image 0.5s ease-in-out`,
                    backgroundImage: weatherData ? applyBackgroundGradient(weatherData.weather[0].main) : 'linear-gradient(to right, #83a4d4,#b6fbff)',
                }}
            >
                <section className="mini-container">
                    <div id="meteo-title">
                        {loading ? (
                            <Lottie
                                options={{
                                    animationData: animationData,
                                    loop: true,
                                    autoplay: true,
                                }}
                                style={{ width: 500, height: 500 }}
                            />
                        ) : (
                            <>
                                <h1 className="title">Today in {city}:</h1>
                                <h1 className="title">{weatherData.weather[0].description}</h1>
                                <h1 className="title">feels like {Math.floor(weatherData.main.feels_like)} C°</h1>
                                <h2 className="sub-title">Min: {Math.floor(weatherData.main.temp_min)} C°</h2>
                                <h2 className="sub-title">Max: {Math.floor(weatherData.main.temp_max)} C°</h2>
                            </>
                        )}
                    </div>

                    <div id="action-area">
                        <SearchLocation onSearch={fetchWeatherBySearchedLocation} />
                    </div>
                    {forecastData && (
                        <div id="forecast_five_days">
                            <Forecast forecast={forecastData} />
                        </div>
                    )}
                </section>
            </section>

            {weatherData && weatherData.clouds && (
                <section id="meteo-area" className="today-data">
                    <UserPlaces /> {/* Aggiunta del componente UserPlaces */}

                    <div className="charts-container" style={{
                        backgroundImage: weatherData ? applyBackgroundGradient(weatherData.weather[0].main) : 'linear-gradient(to right, #83a4d4,#b6fbff)'
                    }}>
                        <WindCharts windSpeed={weatherData.wind.speed} />
                        <TempCharts initialTemperature={weatherData.main.temp} />
                        <PressureCharts initialPressure={weatherData.main.pressure} />
                    </div>

                    <section className="meteo-box-container" style={{
                        backgroundImage: weatherData ? applyBackgroundGradient(weatherData.weather[0].main) : 'linear-gradient(to right, #83a4d4,#b6fbff)'
                    }}>
                        <section id="clouds" className="data-boxes meteo-box">
                            <h3 className="meteo-box-label">Clouds {weatherData.clouds.all}%</h3>
                            <div className="progress-bar">
                                <div className="progress" style={{ width: `${weatherData.clouds.all}%` }}>
                                    <PercentageBox label={`${weatherData.clouds.all}%`} />
                                </div>
                            </div>
                        </section>
                        <section id="humidity" className="data-boxes meteo-box">
                            <h3 className="meteo-box-label">Humidity {weatherData.main.humidity}%</h3>
                            <div className="progress-bar">
                                <div className="progress" style={{ width: `${weatherData.main.humidity}%` }}>
                                    <PercentageBox label={`${weatherData.main.humidity}%`} />
                                </div>
                            </div>
                        </section>
                        <section className="data-boxes">
                            <h3 className="meteo-box">
                                Lon {weatherData.coord.lon}
                            </h3>
                        </section>
                        <section className="data-boxes">
                            <h3 className="meteo-box">
                                Lat {weatherData.coord.lat}
                            </h3>
                        </section>
                        <section className="data-boxes">
                            <h3 className="meteo-box">
                                <Sunrise time={weatherData.sys.sunrise} />
                            </h3>
                        </section>
                        <section className="data-boxes">
                            <h3 className="meteo-box">
                                <Sunset time={weatherData.sys.sunset} />
                            </h3>
                        </section>

                        {airPollutionData && (
                            <section id="airquality" className="data-boxes meteo-box">
                                <h3 className="meteo-box-label">Air Pollution: {airPollutionData.aqi}</h3>
                                <div className="progress-bar">
                                    <div className="progress" style={{ width: `${airPollutionData.aqi}%` }}>
                                        <PercentageBox label={`${airPollutionData.aqi}%`} />
                                    </div>
                                </div>
                            </section>
                        )}

                        {weatherData.visibility && (
                            <section id="visibility" className="data-boxes meteo-box">
                                <h3 className="meteo-box-label">Visibility {weatherData.visibility} meters</h3>
                                <div className="progress-bar">
                                    <div className="progress" style={{ width: `${weatherData.visibility / 100}%` }}>
                                        <PercentageBox label={`${weatherData.visibility} meters`} />
                                    </div>
                                </div>
                            </section>
                        )}

                        {weatherData.main.temp && weatherData.main.humidity && (
                            <section id="dewPoint" className="data-boxes meteo-box">
                                <h3 className="meteo-box-label">Dew Point: {calculateDewPoint(weatherData.main.temp, weatherData.main.humidity).toFixed(2)}°C</h3>
                                <div className="progress-bar">
                                    <div className="progress" style={{ width: `${calculateDewPoint(weatherData.main.temp, weatherData.main.humidity)}%` }}>
                                        <PercentageBox label={`${calculateDewPoint(weatherData.main.temp, weatherData.main.humidity).toFixed(2)}°C`} />
                                    </div>
                                </div>
                            </section>
                        )}
                    </section>
                </section>
            )}

            {location.latitude && (
                <section className="map-section">
                    <WindMap className="weather-map" />
                    <TemperatureMap className="weather-map" />
                    <PrecipitationMap className="weather-map" />
                </section>
            )}
        </>
    );
};

export default WeatherScreen;
