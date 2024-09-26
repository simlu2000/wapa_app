import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation for accessing navigation state
import axios from 'axios';
import { getAuth } from "firebase/auth";
import { getDatabase, ref, set, get } from 'firebase/database';
import { addLocation, removeLocation, getUserLocalities } from '../Utils/userService';
import WindCharts from '../Components/Charts/WindCharts';
import TempCharts from '../Components/Charts/TempCharts';
import TempMCharts from '../Components/Charts/TempMCharts';
import MoreDataCharts from '../Components/Charts/MoreDataCharts';
import PressureCharts from '../Components/Charts/PressureCharts';
import Sunrise from '../Components/Charts/Sunrise';
import Sunset from '../Components/Charts/Sunset';
import Forecast from '../Components/Forecast';
import TodayForecast from '../Components/TodayForecast';
import PercentageBox from '../Components/PercentageBox';
import UserPlaces from '../Components/UserPlaces';
import Loader from '../Components/loader';
import '../Styles/style_weatherscreen.css';
import animationData from '../Animations/Animation - 1726518835813.json';
import Lottie from 'react-lottie';
import { register } from '../serviceWorkerRegistration';

const vapid_key = process.env.REACT_APP_vapid_key;

const WeatherScreen = () => {
    const [weatherData, setWeatherData] = useState(null);
    const [airPollutionData, setAirPollutionData] = useState(null);
    const [city, setCity] = useState('');
    const [location, setLocation] = useState({ latitude: null, longitude: null });
    const [forecastData, setForecastData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userLocalities, setUserLocalities] = useState([]);
    const [user, setUser] = useState(null);
    const locationState = useLocation();
    const [isOffline, setIsOffline] = useState(!navigator.onLine);
    const Api_Key_OpenWeather = process.env.REACT_APP_Api_Key_OpenWeather;

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };

    useEffect(() => {
        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);


    useEffect(() => {
        const getUserLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    position => {
                        if (!location.latitude && !location.longitude) {
                            setLocation({
                                latitude: position.coords.latitude,
                                longitude: position.coords.longitude
                            });
                        }
                    },
                    error => {
                        console.error('Errore nel recupero della posizione dell\'utente', error);
                    }
                );
            } else {
                console.error('Geolocalizzazione non consentita dal browser');
            }
        };

        // Verifica se la posizione è già stata impostata e non ricaricare se già impostata
        if (!location.latitude || !location.longitude) {
            getUserLocation();
        }
    }, [location.latitude, location.longitude]);



    useEffect(() => {
        const fetchWeatherData = async () => {
            if (location.latitude && location.longitude) {
                setLoading(true);
                try {
                    const [weatherResponse, airPollutionResponse, forecastResponse] = await Promise.all([
                        axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${location.latitude}&lon=${location.longitude}&appid=${Api_Key_OpenWeather}&units=metric`),
                        axios.get(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${location.latitude}&lon=${location.longitude}&appid=${Api_Key_OpenWeather}`),
                        axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${location.latitude}&lon=${location.longitude}&appid=${Api_Key_OpenWeather}&units=metric`)
                    ]);

                    setWeatherData(weatherResponse.data);
                    setCity(weatherResponse.data.name);
                    setAirPollutionData(airPollutionResponse.data.list[0].components);
                    setForecastData(forecastResponse.data.list);
                } catch (error) {
                    console.error("Errore durante il recupero dei dati meteorologici", error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchWeatherData();
    }, [location]);

    useEffect(() => {
        if (locationState.state?.query) {
            fetchWeatherBySearchedLocation(locationState.state.query);
        }
    }, [locationState]);


    const fetchWeatherBySearchedLocation = async (searchLocation) => {
        try {
            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?q=${searchLocation}&appid=${Api_Key_OpenWeather}&units=metric`
            );
            setWeatherData(response.data);
            setCity(response.data.name);
            setLocation({
                latitude: response.data.coord.lat,
                longitude: response.data.coord.lon
            });

            const forecastResponse = await axios.get(
                `https://api.openweathermap.org/data/2.5/forecast?lat=${response.data.coord.lat}&lon=${response.data.coord.lon}&appid=${Api_Key_OpenWeather}&units=metric`
            );
            setForecastData(forecastResponse.data.list);
        } catch (error) {
            console.error("Errore. Località non trovata", error);
        }
    };

    useEffect(() => {
        const fetchUserLocalities = async () => {
          if (user) {
            try {
              const localities = await getUserLocalities(user.uid);
              setUserLocalities(localities);
              setLoading(false);
            } catch (error) {
              console.error("Error fetching user localities:", error);
              setLoading(false);
    
            }
          }
        };
    
        fetchUserLocalities();
      }, [user]);
      
    const handleAddLocation = async (location) => {
        if (user) {
          try {
            await addLocation(user.uid, location);
            const localities = await getUserLocalities(user.uid);
            setUserLocalities(localities);
          } catch (error) {
            console.error("Error adding location:", error);
          }
        }
      };
    
      const handleRemoveLocation = async (location) => {
        if (user) {
          try {
            await removeLocation(user.uid, location);
            const localities = await getUserLocalities(user.uid);
            setUserLocalities(localities);
          } catch (error) {
            console.error("Error removing location:", error);
          }
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
            case 'Light Rain':
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
        return (y * alpha) / (x - alpha);
    };

    if (loading) {
        return <Loader />;
    }

    if (!weatherData) {
        return <Loader />;
    }
    const timezone = weatherData.timezone;

    return (
        <>
            {loading ? (
                <div className="animation-container">
                    <Lottie
                        options={defaultOptions}
                        height={"200px"}
                        width={"200px"}
                    />        </div>
            ) : (<>
                <section
                    id="weather-intro"
                    className="container-data"
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'background-image 0.5s ease-in-out',
                        backgroundImage: weatherData ? applyBackgroundGradient(weatherData.weather[0].main) : 'linear-gradient(to right, #83a4d4,#b6fbff)',
                    }}
                >
                    <section className="mini-container">
                        {loading ? (
                            <div className="animation-container">
                                <Lottie options={defaultOptions} height={200} width={200} />
                            </div>
                        ) : (
                            <div id="meteo-title">

                                <>
                                    <h2 className="meteo-subtitle">
                                        {new Date((new Date().getTime() + weatherData.timezone * 1000)).toLocaleTimeString('en-US', { timeZone: 'UTC' })}
                                    </h2>

                                    <h1 className="meteo-title">In {city}:</h1>
                                    <h1 className="meteo-title">{weatherData.weather[0].description}, feels {Math.floor(weatherData.main.feels_like)} °C</h1>
                                    {/*<h1 className="meteo-subtitle">Feels {Math.floor(weatherData.main.feels_like)} °C</h1>*/}
                                    <div>
                                        <h2 className="meteo-subtitle">Min: {Math.floor(weatherData.main.temp_min)} °C</h2>
                                        <h2 className="meteo-subtitle">Max: {Math.floor(weatherData.main.temp_max)} °C</h2>
                                    </div>

                                </>

                            </div>
                        )}

                        {forecastData && (
                            <TodayForecast forecast={forecastData} isMobile={true} />
                        )}
                    </section>
                </section>


                {user && (
                    <section id="loc" className="meteo-box-container">
                        <UserPlaces
                            userId={user.uid}
                            onAddLocation={handleAddLocation}
                            onRemoveLocation={handleRemoveLocation}
                            getUserLocalities={getUserLocalities}
                        />
                    </section>
                )}

                {weatherData && weatherData.clouds && forecastData && (
                    <section id="meteo-area" className="today-data">
                        <Forecast forecast={forecastData} isMobile={true} />

                        <div className="charts-container" style={{
                            backgroundImage: weatherData ? applyBackgroundGradient(weatherData.weather[0].main) : 'linear-gradient(to right, #83a4d4,#b6fbff)'
                        }}>
                            <WindCharts windSpeed={weatherData.wind.speed} />
                            {/*<TempCharts initialTemperature={weatherData.main.temp} />*/}
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
                            <section id="temp-min" className="data-boxes meteo-box">
                                <h3 className="meteo-box-label">Temp Min: {weatherData.main.temp_min} C°</h3>
                                <div className="progress-bar">
                                    <div className="progress" style={{ width: `${weatherData.main.temp_min}%` }}>
                                        <PercentageBox label={`${weatherData.main.temp_min}C°`} />
                                    </div>
                                </div>
                            </section>
                            <section id="temp-max" className="data-boxes meteo-box">
                                <h3 className="meteo-box-label">Temp Max: {weatherData.main.temp_max} C°</h3>
                                <div className="progress-bar">
                                    <div className="progress" style={{ width: `${weatherData.main.temp_max}%` }}>
                                        <PercentageBox label={`${weatherData.main.temp_max}C°`} />
                                    </div>
                                </div>                        </section>
                            <section id="lat" className="data-boxes meteo-box">
                                <h3 className="meteo-box-label">Lat {location.latitude}</h3>
                            </section>
                            <section id="lon" className="data-boxes meteo-box">
                                <h3 className="meteo-box-label">Lon {location.longitude}</h3>
                            </section>
                            <section id="sunrise" className="data-boxes meteo-box">
                                <Sunrise sunriseTime={weatherData.sys.sunrise} />
                            </section>
                            <section id="sunset" className="data-boxes meteo-box">
                                <Sunset sunsetTime={weatherData.sys.sunset} />
                            </section>
                            <section id="dew-point" className="data-boxes meteo-box">
                                <h3 className="meteo-box-label">Dew Point</h3>
                                <MoreDataCharts value={calculateDewPoint(weatherData.main.temp, weatherData.main.humidity).toFixed(1)} />
                            </section>
                            <section id="air-pollution" className="data-boxes meteo-box">
                                <h3 className="meteo-box-label">Air Poll. µg/m³</h3>
                                <MoreDataCharts value={airPollutionData ? airPollutionData.pm2_5 : 'N/A'} />
                            </section>
                        </section>
                    </section>
                )}
            </>)}
        </>
    );
};

export default WeatherScreen;