import React, { useState, useEffect } from "react";
import axios from "axios";

const AstronomicImage = ({ setBackgroundImage, setImageDate }) => {
    const [astronomicImageData, setAstronomicImageData] = useState(null);
    const [error, setError] = useState(null);
    const apiKey = process.env.REACT_APP_Api_Key_NASA;

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
                    setBackgroundImage('');
                    setImageDate('');
                }
            } catch (error) {
                console.error("Error fetching the image:", error);
                setBackgroundImage('');
                setError(error);
            }
        };
        fetchImage();
    }, [apiKey, setBackgroundImage, setImageDate]);

    if (error) return <p className="text-no-data">Error while loading data. Try later.</p>;
    if (!astronomicImageData) return <div>Loading...</div>;

};

export default AstronomicImage;
