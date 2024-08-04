import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import { Api_Key_NASA } from '../Utils/API_KEYS';
import "../Styles/style_marsroverphotos.css"; // Assicurati di avere un file CSS per stilizzare il componente

const MarsRoverPhotos = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_KEY = Api_Key_NASA;

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await axios.get('https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos', {
          params: {
            sol: 1000, // Sol è un giorno marziano
            api_key: API_KEY
          }
        });
        setPhotos(response.data.photos.slice(0, 10)); // Mostra solo le prime 10 foto per evitare un numero eccessivo di immagini
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  if (loading) return <p>Caricamento delle foto in corso...</p>;
  if (error) return <p>Errore nel caricamento delle foto: {error}</p>;

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
