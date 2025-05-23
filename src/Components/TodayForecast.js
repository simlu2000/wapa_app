import React from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import "../Styles/style_forecast.css"; // Assicurati che il percorso sia corretto

// Registrare i componenti necessari di Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const TodayForecast = ({ forecast }) => {
    if (!forecast) {
        return (
            <div className="loading-container">
                <h2>No forecast available</h2>
            </div>
        );
    }

    // Funzione per aggiungere un gradiente di sfondo basato sul meteo
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

    const today = new Date().toLocaleDateString();
    const todayForecast = forecast.filter(item => {
        const forecastDate = new Date(item.dt * 1000).toLocaleDateString();
        return forecastDate === today;
    });

    // Prepara i dati per il grafico
    const labels = todayForecast.map(hour => 
        new Date(hour.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    );

    const temperatureData = todayForecast.map(hour => Math.ceil(hour.main.temp));

    // Applica il gradiente per ogni barra del grafico
    const backgroundColors = todayForecast.map(hour => applyBackgroundGradient(hour.weather[0].main));

    const chartData = {
        labels,
        datasets: [
            {
                label: 'Temperature (°C)',
                data: temperatureData,
                backgroundColor: backgroundColors, 
                borderColor: '#87CEFA',
                borderWidth: 1,
                fill: true,
                yAxisID: 'y',
                borderRadius:50,                
            },
            
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
            padding: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0 
            },
            color:'#000000',
        },
        scales: {
            x: {
                beginAtZero: true,
                ticks: {
                    autoSkip: true,
                    maxTicksLimit: 5,
                    color:'#000000',

                },
                title:{
                    display:true,
                    text:'Time',
                    color:'#000000',
                }
            },
            y: {
                beginAtZero: true,
                ticks: {
                    padding: 5,
                    color:'#000000',
                },
                title:{
                    display:true,
                    text:'Temperature (°C)',
                    color:'#000000',
                },
            },
        },
        plugins: {
            legend: {
                labels: {
                    color: '#000000', 
                },
            },
        },
    };
    

    //condizioni meteo con i rispettivi colori
    const weatherConditions = [
        { label: 'Clear', color: 'rgba(255, 223, 70, 0.7)' },
        { label: 'Clouds', color: 'rgba(150, 150, 150, 0.7)' },
        { label: 'Rain', color: 'rgba(0, 60, 120, 0.7)' },
        { label: 'Snow', color: 'rgba(200, 200, 255, 0.7)' },
        { label: 'Thunderstorm', color: 'rgba(255, 165, 0, 0.7)' },
        { label: 'Drizzle', color: 'rgba(70, 130, 180, 0.7)' },
        { label: 'Fog/Mist/Haze', color: 'rgba(128, 128, 128, 0.7)' },
    ];

    return (
        <section className="today-forecast-container">
            <h2>Today:</h2>
            <div className="today-forecast chart-container">
                <Bar data={chartData} options={options} />
            </div>
            
            <div className="weather-labels">
                <ul className="weather-labels-list">
                    {weatherConditions.map(condition => (
                        <li key={condition.label} className="weather-label-item">
                            <span
                                className="weather-label-color"
                                style={{ backgroundColor: condition.color }}
                            />
                            {condition.label}
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
};

export default TodayForecast;
