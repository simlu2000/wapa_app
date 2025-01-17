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
    const [isLocationReady, setIsLocationReady] = useState(false);  // New state for location readiness

    const navigate = useNavigate();

    const defaultLatitude = 40.7128; // Default latitude (e.g. New York)
    const defaultLongitude = -74.0060; // Default longitude (e.g. New York)

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

    // Recupero della località dell'utente
    useEffect(() => {
        if (!locationState.state?.query) {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        setLocation({
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                        });
                        setIsLocationReady(true);  // Mark location as ready
                    },
                    (error) => {
                        console.error('Error getting location', error);
                        alert("Unable to retrieve your location. Please ensure GPS is enabled or enter a location manually.");
                        setLocation({
                            latitude: defaultLatitude,
                            longitude: defaultLongitude
                        });
                        setIsLocationReady(true);  // Set location ready even if it's the default
                    }
                );
            } else {
                console.error('Geolocation is not supported by this browser');
                setLocation({
                    latitude: defaultLatitude,
                    longitude: defaultLongitude
                });
                setIsLocationReady(true);  // Set location ready even if geolocation isn't supported
            }
        } else {
            setIsLocationReady(true);  // If a query is present, mark location as ready
        }
    }, [locationState]);

    // Recupero dati meteo in base alla posizione
    useEffect(() => {
        if (isLocationReady && location.latitude && location.longitude) {
            fetchWeatherData(location.latitude, location.longitude);
        }
    }, [isLocationReady, location]);

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
            // Split the location by commas, only take the city part (ignoring state or country)
            const locationParts = searchLocation.split(',');
            const city = locationParts[0].trim(); // Get only the city
    
            // Encode the city name for URL compatibility
            const encodedCity = encodeURIComponent(city);
    
            // Fetch coordinates from OpenWeather Geocoding API
            const geoResponse = await axios.get(
                `https://api.openweathermap.org/geo/1.0/direct?q=${encodedCity}&limit=1&appid=${Api_Key_OpenWeather}`
            );
    
            if (geoResponse.data.length === 0) {
                alert("City not found, please check the name and try again.");
                return;
            }
    
            const { lat, lon } = geoResponse.data[0];
    
            // Fetch weather data using the coordinates
            const weatherResponse = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${Api_Key_OpenWeather}&units=metric&lang=it`
            );
    
            // Set the weather data
            setWeatherData(weatherResponse.data);
            setCity(weatherResponse.data.name);
            setLocation({
                latitude: weatherResponse.data.coord.lat,
                longitude: weatherResponse.data.coord.lon
            });
        } catch (error) {
            if (error.response && error.response.status === 404) {
                alert("City not found, please check the name and try again.");
            } else {
                console.error("Error. Location not found", error);
            }
        }
    };
    
    
    // Applicazione dello sfondo gradiente in base al meteo
    const applyBackgroundGradient = (weatherMain) => {
        const gradients = {
            Clear: 'linear-gradient(to bottom, #0083B0, #00B4DB)', 
            Clouds: 'linear-gradient(to bottom, #485563, #29323c)',
            Rain: 'linear-gradient(to bottom, #00416a, #e4e5e6)',
            'Light Rain': 'linear-gradient(to bottom, #00416a, #e4e5e6)',
            Snow: 'linear-gradient(to bottom, #8e9eab, #eef2f3)',
            Thunderstorm: 'linear-gradient(to bottom, #ffb75e, #ed8f03)',
            Drizzle: 'linear-gradient(to right, #4CA1AF, #C4E0E5)',
            Fog: 'linear-gradient(to bottom, #3e5151, #decba4)',
            Mist: 'linear-gradient(to bottom, #3e5151, #decba4)',
            Haze: 'linear-gradient(to bottom, #3e5151, #decba4)',
        };
        return gradients[weatherMain] || 'linear-gradient(to right, #83a4d4, #b6fbff)';
    };

    const handleSearch = (query) => {
        // Prendi solo la prima parte del nome della località (es. 'Milano')
        const city = query.split(',')[0];
        navigate('/WeatherScreen', { state: { query: city } });
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
                    </section>
                </section>
            )}
            {weatherData && airPollutionData && (
                <section id="sunrise-sunset-area" className="charts-container">
                    <Sunrise
                        sunrise={weatherData.sys.sunrise}
                        sunset={weatherData.sys.sunset}
                    />
                    <Sunset
                        sunrise={weatherData.sys.sunrise}
                        sunset={weatherData.sys.sunset}
                    />
                </section>
            )}
        </>
    );
};

export default WeatherScreen;
