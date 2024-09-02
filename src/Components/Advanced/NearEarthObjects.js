import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
//import { Api_Key_NASA } from '../../Utils/API_KEYS';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import "../../Styles/style_object.css"; 

const NearEarthObjects = () => {
  const [objects, setObjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_KEY = process.env.REACT_APP_Api_Key_NASA;

  useEffect(() => {
    const fetchObjects = async () => {
      try {
        const response = await axios.get('https://api.nasa.gov/neo/rest/v1/feed', {
          params: {
            start_date: '2024-08-01', 
            end_date: '2024-08-01',
            api_key: API_KEY,
          },
        });
        setObjects(response.data.near_earth_objects['2024-08-01']);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchObjects();
  }, [API_KEY]);

  if (loading) return <p>Caricamento dei dati in corso...</p>;
  if (error) return <p>Errore nel caricamento dei dati: {error}</p>;

  // Impostazioni dello slider per mostrare 5 oggetti per schermata
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 5,
    arrows: true,
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
    <div className="neo-container">
      <h3 className="neo-title">Oggetti Vicini alla Terra</h3>
      <Slider {...sliderSettings}>
        {objects.map(object => {
          const velocity = object.close_approach_data[0]?.relative_velocity.kilometers_per_hour;
          const formattedVelocity = velocity ? parseFloat(velocity).toFixed(2) : 'N/A';

          return (
            <div key={object.id} className="neo-item">
              <div className="neo-header">
                <strong>{object.name}</strong>
                <span className="neo-date">Data di avvicinamento: {object.close_approach_data[0]?.close_approach_date_full || 'N/A'}</span>
              </div>
              <div className="neo-details">
                <p>
                  <strong>Diametro:</strong> {object.estimated_diameter.meters.estimated_diameter_min.toFixed(1)} - {object.estimated_diameter.meters.estimated_diameter_max.toFixed(1)} m
                </p>
                <p>
                  <strong>Velocità:</strong> {formattedVelocity} km/h
                </p>
                <p>
                  <strong>Distanza dalla Terra:</strong> {object.close_approach_data[0]?.miss_distance.kilometers || 'N/A'} km
                </p>
              </div>
            </div>
          );
        })}
      </Slider>
    </div>
  );
};

export default NearEarthObjects;
