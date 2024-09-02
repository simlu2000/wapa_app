import React, { useEffect, useState } from "react";
import axios from "axios";

const EarthImage = ({ setBackgroundImageUrl }) => {
    const [imageUrl, setImageUrl] = useState('');
    const apiKey = process.env.REACT_APP_Api_Key_NASA;

    useEffect(() => {
        const fetchImage = async () => {
            try {
                // richiesta axios per ottenere immagine quotidiana
                const response = await axios.get(
                    `https://api.nasa.gov/EPIC/api/natural/images?api_key=${apiKey}`
                );
                const data = response.data; // data trovati

                // Otteniamo l'immagine più recente
                if (data.length > 0) {
                    const latestImage = data[0]; // prendo la prima immagine presente nei dati, ovvero la più recente
                    const date = latestImage.date.split(' ')[0].replace(/-/g, '/'); // prendo data dell'immagine 
                    const imageUrl = `https://epic.gsfc.nasa.gov/archive/natural/${date}/png/${latestImage.image}.png`; // url immagine con tale data 
                    setImageUrl(imageUrl); // aggiorno url immagine, usando l'hook useState
                    setBackgroundImageUrl(imageUrl); // imposta l'url dell'immagine di sfondo
                }
            } catch (error) {
                console.error('Errore nel recuperare l\'immagine:', error);
            }
        };

        fetchImage(); // aggiorno immagine
    }, [apiKey, setBackgroundImageUrl]);

    return (
        <div className="planet-area">
            {imageUrl ? ( // se troviamo immagine imposto lo url dell'immagine trovata
                <img src={imageUrl} alt="Daily earth image from NASA EPIC" style={{ width: '100%', height: 'auto' }} />
            ) : ( // altrimenti caricamento
                <p className="loading-text">Loading...</p>
            )}
        </div>
    );
}

export default EarthImage;
