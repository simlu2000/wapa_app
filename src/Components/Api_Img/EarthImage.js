import React, { useEffect, useState } from "react";
import axios from "axios";

const EarthImage = ({ setBackgroundImageUrl }) => {
    const [imageUrl, setImageUrl] = useState('');
    const apiKey = process.env.REACT_APP_Api_Key_NASA;

    useEffect(() => {
        const fetchImage = async () => {
            try {
                const response = await axios.get(
                    `https://api.nasa.gov/EPIC/api/natural/images?api_key=${apiKey}`
                );
                const data = response.data;

                if (data.length > 0) {
                    const latestImage = data[0];
                    const date = latestImage.date.split(' ')[0].replace(/-/g, '/');
                    const imageUrl = `https://epic.gsfc.nasa.gov/archive/natural/${date}/png/${latestImage.image}.png`;
                    setImageUrl(imageUrl);
                    setBackgroundImageUrl(imageUrl);
                }
            } catch (error) {
                if (error) return <p className="text-no-data">Error while loading data. Try later.</p>;
            }
            
        };

        fetchImage();
    }, [apiKey, setBackgroundImageUrl]);

    
    return null;
}

export default EarthImage;
