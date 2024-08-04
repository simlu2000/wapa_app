import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Circle, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import { Api_Key_NASA } from '../../Utils/API_KEYS'; // Ensure this file holds your NASA API key

const OzoneMap = () => {
  const [ozoneData, setOzoneData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const NASA_OZONEMAP_ENDPOINT = 'https://api.nasa.gov/planetary/earth/imagery'; // Replace with actual endpoint

  useEffect(() => {
    const fetchOzoneData = async () => {
      try {
        const response = await axios.get(NASA_OZONEMAP_ENDPOINT, {
          params: {
            lon: 10.0, // Adjust longitude if needed
            lat: 45.0, // Adjust latitude if needed
            dim: 0.1, // Adjust dimension (zoom level) as desired
            date: '2024-08-04', // Update date for current or desired date
            api_key: Api_Key_NASA,
          },
        });

        console.log('Ozone data received:', response.data);

        if (!response.data) {
          throw new Error('Invalid data format from NASA API');
        }

        const formattedData = response.data.map((item) => ({
          lat: item.latitude,
          lon: item.longitude,
          value: item.ozone,
        }));

        setOzoneData(formattedData);
      } catch (error) {
        console.error('Error fetching ozone data:', error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOzoneData();
  }, []);

  if (loading) return <p>Loading ozone data...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <section id="ozone-map">
      <MapContainer center={[45.0, 10.0]} zoom={5} style={{ height: '600px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {ozoneData.map((data, idx) => (
          <Circle
            key={idx}
            center={[data.lat, data.lon]}
            color={getOzoneColor(data.value)} // Dynamic color based on ozone value
            fillColor={getOzoneColor(data.value)}
            fillOpacity={0.5}
            radius={calculateRadius(data.value)} // More flexible radius calculation
          >
            <Popup>
              Ozone Concentration: {data.value} DU
            </Popup>
          </Circle>
        ))}
      </MapContainer>
    </section>
  );
};

// Function to define color based on ozone value (example)
function getOzoneColor(ozoneValue) {
  if (ozoneValue < 220) {
    return 'green';
  } else if (ozoneValue < 250) {
    return 'yellow';
  } else {
    return 'red';
  }
  // You can customize this logic for a wider color range and ozone thresholds
}

// Function to calculate circle radius based on ozone value (example)
function calculateRadius(ozoneValue) {
  return 50000 * (ozoneValue / 300); // Adjust scaling factor as needed
}

export default OzoneMap;
