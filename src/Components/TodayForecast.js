import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faCloudRain, faSnowflake, faBolt, faCloud, faCloudShowersHeavy, faSmog } from '@fortawesome/free-solid-svg-icons';
import "../Styles/style_forecast.css"; // Assicurati che il percorso sia corretto

const TodayForecast = ({ forecast }) => {
    if (!forecast) {
        return (
            <div className="loading-container">
                <h2>No forecast available</h2>
            </div>
        );
    }

    const getWeatherIcon = (weatherMain, size) => {
        switch (weatherMain) {
            case 'Clear':
                return <FontAwesomeIcon icon={faSun} size={size} style={{ color: "#ffd31f", marginRight: '10px' }} />;
            case 'Clouds':
                return <FontAwesomeIcon icon={faCloud} size={size} style={{ color: "#a7a7a7", marginRight: '10px' }} />;
            case 'Rain':
                return <FontAwesomeIcon icon={faCloudShowersHeavy} size={size} style={{ color: "#003d75", marginRight: '10px' }} />;
            case 'Snow':
                return <FontAwesomeIcon icon={faSnowflake} size={size} style={{ color: "#cbcbcb", marginRight: '10px' }} />;
            case 'Thunderstorm':
                return <FontAwesomeIcon icon={faBolt} size={size} style={{ color: "#ffd31f", marginRight: '10px' }} />;
            case 'Drizzle':
                return <FontAwesomeIcon icon={faCloudRain} size={size} style={{ color: "#22a2e3", marginRight: '10px' }} />;
            case 'Fog':
            case 'Mist':
            case 'Haze':
                return <FontAwesomeIcon icon={faSmog} size={size} style={{ color: "#a7a7a7", marginRight: '10px' }} />;
            default:
                return <FontAwesomeIcon icon={faCloud} size={size} style={{ color: "#a7a7a7", marginRight: '10px' }} />;
        }
    };

    const today = new Date().toLocaleDateString();
    const todayForecast = forecast.filter(item => {
        const forecastDate = new Date(item.dt * 1000).toLocaleDateString();
        return forecastDate === today;
    });

    return (
        <section className="today-forecast-container">
            <h2>Today:</h2>
            <div className="today-forecast hour">
                {todayForecast.map((hour, idx) => {
                    const time = new Date(hour.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    const temp = Math.ceil(hour.main.temp);

                    return (
                        <div key={idx} className="today-forecast-item">
                            <p className="forecast-time">{time}</p>
                            <p className="forecast-temp">{temp}°C</p>
                            {getWeatherIcon(hour.weather[0].main, "2x")}
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default TodayForecast;
