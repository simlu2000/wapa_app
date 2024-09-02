import React from "react";
import Slider from "react-slick";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faCloudRain, faSnowflake, faBolt, faCloud, faCloudShowersHeavy, faSmog } from '@fortawesome/free-solid-svg-icons';
import "../Styles/style_weatherscreen.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import "../Styles/style_forecast.css";

const Forecast = ({ forecast }) => {
    
    if (!forecast) {
        return (
            <div className="loading-container">
                <h2>No forecast available</h2>
            </div>
        );
    }


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

   
    const getWeatherIcon = (weatherMain, size, color) => {
        switch (weatherMain) {
            case 'Clear':
                return <FontAwesomeIcon icon={faSun} size={size} style={{ color:"#ffd31f" }} />;
            case 'Clouds':
                return <FontAwesomeIcon icon={faCloud} size={size} style={{ color:"#a7a7a7" }} />;
            case 'Rain':
                return <FontAwesomeIcon icon={faCloudShowersHeavy} size={size} style={{ color:"#003d75" }} />;
            case 'Snow':
                return <FontAwesomeIcon icon={faSnowflake} size={size} style={{ color:"#cbcbcb" }} />;
            case 'Thunderstorm':
                return <FontAwesomeIcon icon={faBolt} size={size} style={{ color:"#ffd31f" }} />;
            case 'Drizzle':
                return <FontAwesomeIcon icon={faCloudRain} size={size} style={{ color:"#22a2e3" }} />;
            case 'Fog':
            case 'Mist':
            case 'Haze':
                return <FontAwesomeIcon icon={faSmog} size={size} style={{ color:"#a7a7a7" }} />;
            default:
                return <FontAwesomeIcon icon={faCloud} size={size} style={{ color:"#a7a7a7" }} />;
        }
    };

    
    const dailyForecast = forecast.reduce((acc, item) => {
        const date = new Date(item.dt * 1000).toLocaleDateString();
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(item);
        return acc;
    }, {});

   
    const forecastItems = Object.keys(dailyForecast).map((date, index) => {
        const dayData = dailyForecast[date];
        const temperatures = dayData.map(item => item.main.temp);
        const weatherMain = dayData[0].weather[0].main;

        return {
            date,
            weatherMain,
            temperatures,
            icon: getWeatherIcon(weatherMain, "4x", "#F7F7F7"),
            minTemp: Math.min(...temperatures),
            maxTemp: Math.max(...temperatures),
        };
    });

    
    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        arrows: true,
        autoplay: false,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    };

    return (
        <section className="forecast-container">
            {forecast ? (
                <Slider {...settings}>
                    {forecastItems.slice(0, 5).map((item, index) => (
                        <div key={index} className="forecast-item" style={{ background: applyBackgroundGradient(item.weatherMain) }}>
                            <h3 className="date">{item.date}</h3>
                            <div className="weatherIcon">{item.icon}</div>
                            <p className="temp">Min: {item.minTemp}°C Max: {item.maxTemp}°C</p>
                        </div>
                    ))}
                </Slider>
            ) : (
                <div className="loading-container">
                    <h2>No forecast available</h2>
                </div>
            )}
        </section>
    );
};

export default Forecast;
