import React, { useState, useEffect } from "react";
import axios from "axios";

const AstronomicImage = () => {
    const [astronomicImageData, setAstronomicImageData] = useState(null);
    const [error, setError] = useState(null);
    const apiKey = '8LrUPVfP91fRLfWacR9hjPpSmFalwWcaYrIr2Hcx'; // API Key NASA

    useEffect(() => {
        const fetchImage = async () => {
            try {
                const response = await axios.get(
                    'https://api.nasa.gov/planetary/apod', {
                        params: {
                            api_key: apiKey,
                        },
                    }
                );
                console.log(response.data); // Log dei dati per il debug
                setAstronomicImageData(response.data);
            } catch (error) {
                console.error("Error fetching the image:", error);
                setError(error);
            }
        };
        fetchImage();
    }, [apiKey]);

    if (error) return <div>Error: {error.message}</div>;
    if (!astronomicImageData) return <div>Loading...</div>;

    return ( //.title, .date e .explanation
        <div>
            
            <p>{astronomicImageData.date}</p>
            {astronomicImageData.media_type === 'image' ? ( //se immagine dai immagine altrimenti un iframe con video
                <img src={astronomicImageData.url}  alt={astronomicImageData.title} style={{ maxWidth: '100%' }} />
            ) : (
                <iframe
                    title="space-video"
                    src={`${astronomicImageData.url}?autoplay=1&mute=1`} //forza autoplay del video e mette il muto
                    frameBorder="0"
                    allow="encrypted-media"
                    allowFullScreen
                    style={{ maxWidth: '100%' }}
                />
            )}
        </div>
    );
};

export default AstronomicImage;
