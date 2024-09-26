import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import "../../Styles/style_marsroverphotos.css"; // Assicurati di avere un file CSS per stilizzare il componente

const MarsRoverPhotos = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_KEY = process.env.REACT_APP_Api_Key_NASA;

  useEffect(() => {
    const fetchMostRecentPhotos = async () => {
      const today = new Date();
      let currentDate = today;
      let photosFound = [];

      // Funzione per formattare la data nel formato richiesto (AAAA-MM-GG)
      const formatDate = (date) => date.toISOString().split('T')[0];

      // Tenta di trovare foto nei giorni precedenti
      while (photosFound.length === 0 && currentDate >= new Date('2012-08-06')) { // Data minima per il rover Curiosity
        try {
          const dateString = formatDate(currentDate);
          console.log(`Checking for photos on date: ${dateString}`);
          const response = await axios.get('https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos', {
            params: {
              earth_date: dateString,
              api_key: API_KEY,
            },
          });

          // Controlla se 'photos' esiste e se è un array
          if (Array.isArray(response.data.photos)) {
            photosFound = response.data.photos;

            // Se sono state trovate foto, aggiornare lo stato
            if (photosFound.length > 0) {
              setPhotos(photosFound.slice(0, 10)); // Mostra solo le prime 10 foto
            }
          } else {
            console.error(`Nessuna foto trovata per la data ${dateString}.`);
          }
        } catch (error) {
          console.error(`Errore durante il fetch delle foto per la data ${formatDate(currentDate)}:`, error);
          setError(error.message);
        }

        // Sottrai un giorno
        currentDate.setDate(currentDate.getDate() - 1);
      }

      if (photosFound.length === 0) {
        setError('Nessuna foto disponibile nelle date recenti.');
      }
      setLoading(false);
    };

    fetchMostRecentPhotos();
  }, [API_KEY]);

  if (loading) return <p className="loading">Caricamento delle foto in corso...</p>;
  if (error) return <p className="loading">Errore nel caricamento delle foto: {error}</p>;

  // Impostazioni dello slider
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };

  return (
    <section id="mars-area">
      <Slider {...sliderSettings}>
        {photos.map(photo => (
          <div key={photo.id} className="photo-slide">
            <img src={photo.img_src} alt={`Foto del rover ${photo.rover.name}`} />
            <div className="photo-info">
              <p><strong>Rover:</strong> {photo.rover.name}</p>
              <p><strong>Data:</strong> {photo.earth_date}</p>
            </div>
          </div>
        ))}
      </Slider>
    </section>
  );
};

export default MarsRoverPhotos;
