import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Api_Key_NASA } from '../Utils/API_KEYS';

const NearEarthObjects = () => {
  const [objects, setObjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_KEY = Api_Key_NASA; 

  useEffect(() => {
    const fetchObjects = async () => {
      try {
        const response = await axios.get('https://api.nasa.gov/neo/rest/v1/feed', {
          params: {
            start_date: '2024-08-01', // Cambia con una data dinamica se necessario
            end_date: '2024-08-01',
            api_key: API_KEY
          }
        });
        setObjects(response.data.near_earth_objects['2024-08-01']); // Usa la data corretta
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchObjects();
  }, []);

  if (loading) return <p>Caricamento dei dati in corso...</p>;
  if (error) return <p>Errore nel caricamento dei dati: {error}</p>;

  return (
    <div>
      <h3>Oggetti Vicini alla Terra</h3>
      <ul>
        {objects.map(object => (
          <li key={object.id}>
            <strong>{object.name}</strong> - Diametro: {object.estimated_diameter.meters.estimated_diameter_min.toFixed(1)} - {object.estimated_diameter.meters.estimated_diameter_max.toFixed(1)} m
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NearEarthObjects;
