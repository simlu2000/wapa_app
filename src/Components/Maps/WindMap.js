import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { Api_Key_OpenWeather } from '../../Utils/API_KEYS';

const WindMap = () => {
    const position = [51.505, -0.09]; //pos default

    return (
        <div className="weather-map-area" id="m1">
            <h1 class="map-title">Wind Map</h1>
            <MapContainer  className="weather-map" center={position} zoom={3}>
                <TileLayer
                    url={`https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${Api_Key_OpenWeather}`}
                    attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
            </MapContainer>
        </div>
    );
};

export default WindMap;
