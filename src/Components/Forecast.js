import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faCloudRain, faSnowflake, faBolt, faCloud, faCloudShowersHeavy, faSmog } from '@fortawesome/free-solid-svg-icons';
import "../Styles/style_forecast.css"; // Assicurati che il percorso sia corretto

const Forecast = ({ forecast }) => {
    if (!forecast) {
        return (
            <div className="loading-container">
                
            </div>
        );
    }

    const applyBackgroundGradient = (weatherMain) => {
        switch (weatherMain) {
            case 'Clear':
                return 'linear-gradient(to bottom, #0083B0, #00B4DB)';
            case 'Clouds':
                return 'linear-gradient(to bottom, #485563, #29323c)';
            case 'Rain':
                return 'linear-gradient(to bottom, #00416a, #e4e5e6)';
            case 'Light Rain':
                return 'linear-gradient(to bottom, #00416a, #e4e5e6)';
            case 'Snow':
                return 'linear-gradient(to bottom, #8e9eab, #eef2f3)';
            case 'Thunderstorm':
                return 'linear-gradient(to bottom, #ffb75e, #ed8f03)';
            case 'Drizzle':
                return 'linear-gradient(to right, #4CA1AF, #C4E0E5)';
            case 'Fog':
            case 'Mist':
            case 'Haze':
                return 'linear-gradient(to bottom, #3e5151, #decba4)';
            default:
                return 'linear-gradient(to right, #83a4d4, #b6fbff)';
        }
    };

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

    // Funzione per ottenere il giorno della settimana
    const getDayOfWeek = (date) => {
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        return days[date.getDay()];
    };

    // Filtriamo i dati dei giorni successivi, eliminando il giorno corrente
    const dailyForecast = forecast.reduce((acc, item) => {
        const date = new Date(item.dt * 1000);
        const today = new Date();
        if (date.toLocaleDateString() !== today.toLocaleDateString()) {
            const dayOfWeek = getDayOfWeek(date);
            const formattedDate = `${dayOfWeek}`;
            if (!acc[formattedDate]) {
                acc[formattedDate] = [];
            }
            acc[formattedDate].push(item);
        }
        return acc;
    }, {});

    const forecastItems = Object.keys(dailyForecast).map((date) => {
        const dayData = dailyForecast[date];
        const weatherMain = dayData[0].weather[0].main;

        return {
            date,
            weatherMain,
            hourlyData: dayData,
            icon: getWeatherIcon(weatherMain, "4x"),
        };
    });

    return (
        <section className="meteo-table forecast-container" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-image 0.5s ease-in-out',
        }}>
            <h2>Next 5 days</h2>
            <table className="forecast-table">
                <thead>
                    <tr>
                        <th>Day</th>
                        {forecastItems[0].hourlyData.map((hour, idx) => {
                            const time = new Date(hour.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                            return <th className="hour" key={idx}>{time}</th>;
                        })}
                    </tr>
                </thead>
                <tbody>
                    {forecastItems.map((item, index) => (
                        <tr key={index} style={{ background: applyBackgroundGradient(item.weatherMain) }}>
                            <td className="info">{item.date}</td>
                            {item.hourlyData.map((hour, idx) => {
                                const temp = Math.ceil(hour.main.temp);
                                return (
                                    <td className="info-temp" key={idx}>
                                        {temp}°C {getWeatherIcon(hour.weather[0].main, "1x")}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
    );
};

export default Forecast;
