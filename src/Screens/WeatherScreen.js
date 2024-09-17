import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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
                body: 'Temperature extremely high! Drink a lot of water and avoid the sun!',
            };
        }

        if (notificationPayload && user) {
            const now = new Date();
            if (now.getHours() === 11 && now.getMinutes() === 5) {
                navigator.serviceWorker.ready.then(registration => {
                    registration.showNotification(notificationPayload.title, {
                        body: notificationPayload.body,
                        icon: '../img/logo.png',
                    });
                });
            }
        }
    };

    useEffect(() => {
        if (weatherData) {
            checkWeatherAndNotify(weatherData);
        }
    }, [weatherData]);

    if (loading) {
        return <Loader />;
    }

    if (isOffline) {
        return (
            <div className="offline-container">
                <h2>You are offline. Please check your connection.</h2>
                <Lottie options={defaultOptions} height={400} width={400} />
            </div>
        );
    }

    return (
        <div className="weather-screen" style={{ background: applyBackgroundGradient(weatherData?.weather[0]?.main) }}>
            <TodayForecast data={weatherData} />
            <Forecast data={forecastData} />
            <WindCharts data={weatherData} />
            <TempCharts data={weatherData} />
            <TempMCharts data={weatherData} />
            <PressureCharts data={weatherData} />
            <Sunrise data={weatherData} />
            <Sunset data={weatherData} />
            <PercentageBox data={airPollutionData} />
            <UserPlaces
                localities={userLocalities}
                onAddLocation={handleAddLocation}
                onRemoveLocation={handleRemoveLocation}
                onSelectLocation={handleSelectLocation}
            />
        </div>
    );
};

export default WeatherScreen;
