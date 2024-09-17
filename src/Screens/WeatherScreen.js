import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation for accessing navigation state
import axios from 'axios';
import { auth } from '../Utils/firebase';
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
                        console.error('Error retrieving user location', error);
                    }
                );
            } else {
                console.error('Geolocation not permitted by the browser');
            }
        };
        getUserLocation();
    }, []);

    useEffect(() => {
        const fetchWeatherData = async () => {
            if (location.latitude && location.longitude) {
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
                    console.error("Error during fetching weather data", error);
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
            console.error("Error. Location not found", error);
        }
    };

    const handleAddLocation = async (location) => {
        if (user) {
            await addLocation(user.uid, location);
            const localities = await getUserLocalities(user.uid);
            setUserLocalities(localities);
        }
    };

    const handleRemoveLocation = async (location) => {
        if (user) {
            await removeLocation(user.uid, location);
            const localities = await getUserLocalities(user.uid);
            setUserLocalities(localities);
        }
    };

    const handleSelectLocation = (location) => {
        fetchWeatherBySearchedLocation(location);
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

    const checkWeatherAndNotify = (weatherData) => {
        if (!weatherData) return;

        const weatherMain = weatherData.weather[0].main;
        let notificationPayload = null;

        if (weatherMain === 'Rain') {
            notificationPayload = {
                title: 'Weather Alert',
                body: 'Rain expected tomorrow, get your umbrella!',
            };
        } else if (weatherMain === 'Thunderstorm') {
            notificationPayload = {
                title: 'Weather Alert',
                body: 'Thunderstorm alert! Stay indoors and avoid outdoor activities!',
            };
        } else if (weatherData.main.temp < 0) {
            notificationPayload = {
                title: 'Weather Alert',
                body: 'Temperature extremely low! Dress warmly!',
            };
        } else if (weatherData.main.temp > 35) {
            notificationPayload = {
                title: 'Weather Alert',
                body: 'Temperature extremely high! Drink a lot of water and avoid direct sun!',
            };
        } else if (weatherData.main.temp < 25) {
            notificationPayload = {
                title: 'Weather Alert TEST',
                body: 'TEST: Temperature < 25'
            }
        }

        if (notificationPayload) {
            sendNotification(notificationPayload);
        }
    };

    const checkTimeAndNotify = (weatherData) => {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();

        if(hours == 11 && minutes === 0){
            checkWeatherAndNotify(weatherData);
        }else{
            console.log('Not now for the notification');
        }
    };

    // Imposta un intervallo per controllare il tempo ogni minuto
    setInterval(() => {
        checkTimeAndNotify(weatherData);
    }, 60000); // 60,000 ms = 1 minuto

    const sendNotification = (payload) => {
        if ('Notification' in window && navigator.serviceWorker) {
            navigator.serviceWorker.ready.then((registration) => {
                registration.showNotification(payload.title, {
                    body: payload.body,
                    icon: '../img/logo.png'
                });
            });
        } else {
            console.log('Notifications are not supported.');
        }
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
                        <div className="animation-container">
                            <Lottie options={defaultOptions} height={200} width={200} />
                        </div>
                    ) : (
                        <div id="meteo-title">

                            <>
                                <h1 className="meteo-title">In {city}:</h1>
                                <h1 className="meteo-title">{weatherData.weather[0].description}</h1>
                                <h1 className="meteo-title">Feels {Math.floor(weatherData.main.feels_like)} °C</h1>
                                <h2 className="meteo-subtitle">Min: {Math.floor(weatherData.main.temp_min)} °C</h2>
                                <h2 className="meteo-subtitle">Max: {Math.floor(weatherData.main.temp_max)} °C</h2>
                            </>

                        </div>
                    )}

                    {forecastData && (
                        <TodayForecast forecast={forecastData} isMobile={true} />
                    )}
                </section>
            </section>

            {weatherData && weatherData.clouds && forecastData && (
                <section id="meteo-area" className="today-data">
                    <Forecast forecast={forecastData} isMobile={true} />

                    {user && (
                        <section id="loc" className="meteo-box-container" style={{
                            backgroundImage: weatherData ? applyBackgroundGradient(weatherData.weather[0].main) : 'linear-gradient(to right, #83a4d4,#b6fbff)'
                        }}>
                            <UserPlaces
                                userId={user.uid}
                                onAddLocation={handleAddLocation}
                                onRemoveLocation={handleRemoveLocation}
                                onSelectLocation={handleSelectLocation}
                                getUserLocalities={getUserLocalities}
                            />
                        </section>
                    )}

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
        </>
    );
};

export default WeatherScreen;
