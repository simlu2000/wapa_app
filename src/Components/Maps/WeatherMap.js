import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

function WeatherMap() {
  const [position, setPosition] = useState([51.505, -0.09]); // Posizione di default per la mappa

  return (
    <div>
      <h1>Weather Map</h1>
      <MapContainer  className="weather-map" center={position} zoom={13} style={{ height: '400px' }}>
        <TileLayer
          attribution='Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* Marker e Popup qui */}
      </MapContainer>
    </div>
  );
}

export default WeatherMap;
