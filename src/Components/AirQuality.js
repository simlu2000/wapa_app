import React, { useState, useEffect } from "react";
import axios from "axios";
import WeatherScreen from "../Screens/WeatherScreen";
import "../Styles/style_weatherscreen.css";
import "../Utils/API_KEYS";
import { Api_Key_AirVisual } from "../Utils/API_KEYS";

const AirQuality = ({ city, backgroundColor }) => {
    const [airQuality, setAirQuality] = useState(null);

    useEffect(() => {
        const fetchAirQuality = async () => {
            try {
                const encodedCity = encodeURIComponent(city); //codifico perchè potrebbe avere spazi o car speciali
                const response = await axios.get(
                    `https://api.airvisual.com/v2/city?city=${encodedCity}&key=${Api_Key_AirVisual}`
                );

                // Verifica la struttura della risposta API per accedere correttamente all'indice AQI
                setAirQuality(response.data.data.current.pollution.aqius);
            } catch (error) {
                if (error.response) {
                    // La richiesta è stata fatta e il server ha risposto con uno stato di errore
                    console.error('Error response from server:', error.response.data);
                } else if (error.request) {
                    // La richiesta è stata fatta ma non è stata ricevuta alcuna risposta
                    console.error('No response received:', error.request);
                } else {
                    // Si è verificato un errore durante la richiesta
                    console.error('Error during request:', error.message);
                }
            }
        };
        fetchAirQuality();
    }, [city]); // Assicurati che useEffect venga eseguito ogni volta che cambia la città

    return (
        <section className="data-boxes">
            <h3 className="meteo-box" style={{ backgroundImage: backgroundColor }}>
                AQI in {city}: {airQuality !== null ? airQuality : 'Loading...'}
            </h3>
        </section>
    );
};

export default AirQuality;
