import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation for accessing navigation state
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { auth } from '../Utils/firebase';
import { getUserLocalities } from '../Utils/userService';
import WindCharts from '../Components/Charts/WindCharts';
import MoreDataCharts from '../Components/Charts/MoreDataCharts';
import PressureCharts from '../Components/Charts/PressureCharts';
import Sunrise from '../Components/Charts/Sunrise';
import Sunset from '../Components/Charts/Sunset';
import Forecast from '../Components/Forecast';
import TodayForecast from '../Components/TodayForecast';
import PercentageBox from '../Components/PercentageBox';
import SearchLocation from '../Components/SearchLocation';
import Loader from '../Components/loader';
import '../Styles/style_weatherscreen.css';
import animationData from '../Animations/Animation - 1726518835813.json';

const Api_Key_OpenWeather = process.env.REACT_APP_Api_Key_OpenWeather;

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

    const navigate = useNavigate();


    // Gestione dello stato online/offline
    useEffect(() => {
        const handleOnlineStatusChange = () => setIsOffline(!navigator.onLine);

        window.addEventListener('online', handleOnlineStatusChange);
        window.addEventListener('offline', handleOnlineStatusChange);

        return () => {
            window.removeEventListener('online', handleOnlineStatusChange);
            window.removeEventListener('offline', handleOnlineStatusChange);
        };
    }, []);

    // Autenticazione e recupero delle località utente
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                try {
                    const localities = await getUserLocalities(currentUser.uid);
                    setUserLocalities(localities);
                } catch (error) {
                    console.error('Error fetching user localities', error);
                }
            }
        });

        return () => unsubscribe();
    }, []);

    // Recupero dati meteo in base alla posizione
    useEffect(() => {
        if (location.latitude && location.longitude) {
            fetchWeatherData(location.latitude, location.longitude);
        } else if (!locationState.state?.query) {
            // Se non è stata selezionata una città, usa il GPS per ottenere la posizione dell'utente
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        setLocation({
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                        });
                    },
                    (error) => {
                        console.error('Error getting location', error);
                    }
                );
            } else {
                console.error('Geolocation is not supported by this browser');
            }
        }
    }, [locationState, location]);

    // Recupero dati meteo in base alla città cercata
    useEffect(() => {
        if (locationState.state?.query) {
            fetchWeatherBySearchedLocation(locationState.state.query);
        }
    }, [locationState]);

    // Funzione per recuperare i dati meteo
    const fetchWeatherData = async (latitude, longitude) => {
        if (!latitude || !longitude) {
            console.error("Invalid latitude or longitude");
            return;
        }
    
        try {
            const [weatherResponse, airPollutionResponse, forecastResponse] = await Promise.all([
                axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${Api_Key_OpenWeather}&units=metric`),
                axios.get(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=${Api_Key_OpenWeather}`),
                axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${Api_Key_OpenWeather}&units=metric`)
            ]);
    
            if (weatherResponse.data && weatherResponse.data.weather) {
                setWeatherData(weatherResponse.data);
                setCity(weatherResponse.data.name);
                setAirPollutionData(airPollutionResponse.data.list[0].components);
                setForecastData(forecastResponse.data.list);
            } else {
                console.error("Weather data not found");
            }
        } catch (error) {
            console.error("Error during fetching weather data", error);
        } finally {
            setLoading(false);
        }
    };
    

    // Funzione per recuperare i dati meteo in base alla località cercata
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
            console.error("Error. Location not found", error);
        }
    };

    // Applicazione dello sfondo gradiente in base al meteo
    const applyBackgroundGradient = (weatherMain) => {
        const gradients = {
            Clear: 'linear-gradient(to top, #fff1eb 0%, #ace0f9 100%)',
            Clouds: 'linear-gradient(-20deg, #616161 0%, #9bc5c3 100%)',
            Rain: 'linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%)',
            'Light Rain': 'linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%)',
            Snow: 'linear-gradient(to top, #e6e9f0 0%, #eef1f5 100%)',
            Thunderstorm: 'linear-gradient(to right, #f83600 0%, #f9d423 100%)',
            Drizzle: 'linear-gradient(to right, #4CA1AF, #C4E0E5)',
            Fog: 'linear-gradient(to right, #757F9A, #D7DDE8)',
            Mist: 'linear-gradient(to right, #757F9A, #D7DDE8)',
            Haze: 'linear-gradient(to right, #757F9A, #D7DDE8)',
        };
        return gradients[weatherMain] || 'linear-gradient(to right, #83a4d4, #b6fbff)';
    };

    const handleSearch = (query) => {
        navigate('/WeatherScreen', { state: { query } });
    };

    const calculateDewPoint = (temp, hum) => {
        const x = 17.27;
        const y = 237.7;
        const alpha = (x * temp) / (y + temp) + Math.log(hum / 100);
        return (y * alpha) / (x - alpha);
    };


    return (
        <>
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
                        <Loader />
                    ) : (
                        <div id="meteo-title">

                            <>
                                <h1 id="place" className="meteo-title">In {city}:</h1>
                                <h1 id="place-subtitle" className="meteo-title">{weatherData.weather[0].description}, 
                                    feels {Math.floor(weatherData.main.feels_like)} °C
                                </h1>
                                <div>
                                    <h2 className="meteo-subtitle">Min: {Math.floor(weatherData.main.temp_min)} °C</h2>
                                    <h2 id="max" className="meteo-subtitle">Max: {Math.floor(weatherData.main.temp_max)} °C</h2>

                                </div>
                                <SearchLocation onSearch={handleSearch} />

                            </>



                        </div>
                    )}


                </section>
            </section>

            <Forecast forecast={forecastData} isMobile={true} />

            {forecastData && (
                <section id="today-area" >
                    <TodayForecast forecast={forecastData} isMobile={true} />
                </section>
            )}

            {weatherData && weatherData.clouds && forecastData && (
                <section id="meteo-area" className="today-data">


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
                            </div>
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
        </>
    );
};

export default WeatherScreen;