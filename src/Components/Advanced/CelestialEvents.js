import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../../Styles/style_celestialevents.css";

const CelestialEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const API_KEY = process.env.REACT_APP_Api_Key_NASA;
    const url = 'https://api.nasa.gov/planetary/apod'; 

    const fetchCelestialEvents = async () => {
      try {
        const response = await axios.get(url, {
          params: {
            api_key: API_KEY,
          },
        });

        // Log della risposta per debug
        console.log('Dati ricevuti:', response.data);

        // Supponiamo che la risposta sia una lista di eventi, modifica in base alla struttura reale
        const data = Array.isArray(response.data) ? response.data : [response.data];

        setEvents(data);
      } catch (error) {
        console.error('Errore nel recupero dei dati:', error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCelestialEvents();
  }, []);

  if (loading) return <p>Loading data...</p>;
  if (error) return <p className="text-no-data">Error while loading data. Try later.</p>;

  return (
    <section id="celestial-events">
      {events.length > 0 ? (
        <ul>
          {events.map((event, idx) => (
            <li key={idx}>
              <strong>{event.title || 'Event name'}</strong>: {event.explanation || 'Description'} (Date: {event.date || 'Date not available'})
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-no-data">No predicted data.</p>
      )}
    </section>
  );
};

export default CelestialEvents;
