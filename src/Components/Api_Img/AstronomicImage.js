import React, { useState, useEffect } from "react";
import axios from "axios";
import { Api_Key_NASA } from '../../Utils/API_KEYS';

const AstronomicImage = ({ setBackgroundImage, setImageDate }) => {
    const [astronomicImageData, setAstronomicImageData] = useState(null);
    const [error, setError] = useState(null);
    const apiKey = Api_Key_NASA;

    useEffect(() => {
        const fetchImage = async () => {
            try {
                const response = await axios.get(
                    'https://api.nasa.gov/planetary/apod', {
                        params: { api_key: apiKey },
                    }
                );
                console.log(response.data); // Log dei dati per il debug
                setAstronomicImageData(response.data);

                if (response.data.media_type === 'image') {
                    setBackgroundImage(response.data.url);
                    setImageDate(response.data.date);
                } else {
                    setBackgroundImage(''); // o un URL di default per i video
                    setImageDate('');
                }
            } catch (error) {
                console.error("Error fetching the image:", error);
                setError(error);
            }
        };
        fetchImage();
    }, [apiKey, setBackgroundImage, setImageDate]);

    if (error) return <div>Error: {error.message}</div>;
    if (!astronomicImageData) return <div>Loading...</div>;

    return null; 
};

export default AstronomicImage;
