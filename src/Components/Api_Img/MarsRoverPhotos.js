import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import "../../Styles/style_marsroverphotos.css"; // Assicurati di avere un file CSS per stilizzare il componente

// Componenti per le frecce personalizzate
const NextArrow = ({ className, style, onClick }) => (
  <div
    className={className}
    style={{ ...style, display: 'block', background: 'black', borderRadius: '50%' }}
    onClick={onClick}
  />
);

const PrevArrow = ({ className, style, onClick }) => (
  <div
    className={className}
    style={{ ...style, display: 'block', background: 'black', borderRadius: '50%' }}
    onClick={onClick}
  />
);

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

      const formatDate = (date) => date.toISOString().split('T')[0];

      while (photosFound.length === 0 && currentDate >= new Date('2012-08-06')) {
        try {
          const dateString = formatDate(currentDate);
          const response = await axios.get('https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos', {
            params: {
              earth_date: dateString,
              api_key: API_KEY,
            },
          });

          if (Array.isArray(response.data.photos)) {
            photosFound = response.data.photos;
            if (photosFound.length > 0) {
              setPhotos(photosFound.slice(0, 10));
            }
          }
        } catch (error) {
          setError(error.message);
        }
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

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 5,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
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
