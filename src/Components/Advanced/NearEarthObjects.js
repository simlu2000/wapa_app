import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import "../../Styles/style_object.css"; 

// Componenti per frecce personalizzate
const NextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} custom-arrow custom-arrow-next`}
      style={{ ...style }}
      onClick={onClick}
    />
  );
};

const PrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} custom-arrow custom-arrow-prev`}
      style={{ ...style }}
      onClick={onClick}
    />
  );
};

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

  if (loading) return <p>Loading data...</p>;
  if (error) return <p>Error while loading data: {error}</p>;

 // Impostazioni dello slider
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
  <div className="neo-container">
    <h3 className="neo-title">Objects near Earth</h3>
    <Slider {...sliderSettings}>
      {objects.map(object => {
        const velocity = object.close_approach_data[0]?.relative_velocity.kilometers_per_hour;
        const formattedVelocity = velocity ? parseFloat(velocity).toFixed(2) : 'N/A';

        return (
          <div key={object.id} className="neo-item">
            <div className="neo-header">
              <strong>{object.name}</strong>
              <span className="neo-date">Data of approach: {object.close_approach_data[0]?.close_approach_date_full || 'N/A'}</span>
            </div>
            <div className="neo-details">
              <p>
                <strong>Diameter:</strong> {object.estimated_diameter.meters.estimated_diameter_min.toFixed(1)} - {object.estimated_diameter.meters.estimated_diameter_max.toFixed(1)} m
              </p>
              <p>
                <strong>Velocity:</strong> {formattedVelocity} km/h
              </p>
              <p>
                <strong>Distance form Earth:</strong> {object.close_approach_data[0]?.miss_distance.kilometers || 'N/A'} km
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