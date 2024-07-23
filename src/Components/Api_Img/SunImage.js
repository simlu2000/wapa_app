import React, { useState, useEffect } from "react";

const SunImage = () => {
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    const fetchSunImage = async () => {
      try {
        const date = new Date().toISOString().split("T")[0]; // Data corrente in formato YYYY-MM-DD
        const response = await fetch(
          `https://api.helioviewer.org/v2/screenshot/?date=${date}&sourceId=14&jpip=false`
        );
        const data = await response.json();
        setImageUrl(data.url); // Assumendo che l'URL dell'immagine sia in 'url'
      } catch (error) {
        console.error("Error fetching the sun image", error);
      }
    };
    fetchSunImage();
  }, []);

  return (
    <div>
      {imageUrl ? (
        <img src={imageUrl} alt="Daily Sun Image" />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default SunImage;
