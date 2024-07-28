import React, { useState, useEffect } from 'react';
import '../Styles/style_userplaces.css';

const UserPlaces = ({ weatherData, userId, onAddLocation, onRemoveLocation, onSelectLocation, getUserLocalities }) => {
    const [localities, setLocalities] = useState([]);
    const [newLocation, setNewLocation] = useState('');

    useEffect(() => {
        const fetchLocalities = async () => {
            try {
                const localitiesList = await getUserLocalities(userId);
                setLocalities(localitiesList);
            } catch (error) {
                console.error("Error fetching localities:", error);
            }
        };

        if (userId) {
            fetchLocalities();
        }
    }, [userId, getUserLocalities]);

    const handleAddClick = async () => {
        if (newLocation && localities.length < 6) {
            try {
                await onAddLocation(newLocation);
                const updatedLocalities = await getUserLocalities(userId);
                setLocalities(updatedLocalities);
                setNewLocation('');
            } catch (error) {
                console.error("Error adding location:", error);
            }
        }
    };

    const handleRemoveClick = async (location) => {
        try {
            await onRemoveLocation(location);
            const updatedLocalities = await getUserLocalities(userId);
            setLocalities(updatedLocalities);
        } catch (error) {
            console.error("Error removing location:", error);
        }
    };
    const applyBackgroundGradient = (weatherMain) => {
        switch (weatherMain) {
            case 'Clear':
                return 'linear-gradient(to top, #fff1eb 0%, #ace0f9 100%)';
            case 'Clouds':
                return 'linear-gradient(-20deg, #616161 0%, #9bc5c3 100%)';
            case 'Rain':
                return 'linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%)';
            case 'Snow':
                return 'linear-gradient(to top, #e6e9f0 0%, #eef1f5 100%)';
            case 'Thunderstorm':
                return 'linear-gradient(to right, #f83600 0%, #f9d423 100%)';
            case 'Drizzle':
                return 'linear-gradient(to right, #4CA1AF, #C4E0E5)';
            case 'Fog':
            case 'Mist':
            case 'Haze':
                return 'linear-gradient(to right, #757F9A, #D7DDE8)';
            default:
                return 'linear-gradient(to right, #83a4d4, #b6fbff)';
        }
    };

    return (
        <section className="user-places-container" >
            <h2 id="fav-text">Your favorite places</h2>
            <input
                type="text"
                id="fav-insert"
                className="new-loc"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                placeholder="Add new location"
            />
            <button
                className="new-loc"
                onClick={handleAddClick}
                disabled={localities.length >= 6}
            >
                Add
            </button>
            <ul>
                {localities.map((loc) => (
                    <li key={loc}>
                        <button id="location" className="btn-loc" onClick={() => onSelectLocation(loc)}>{loc}</button>
                        <button className="btn-del" id="bt1" onClick={() => handleRemoveClick(loc)}>Delete</button>
                    </li>
                ))}
            </ul>
        </section>
    );
};

export default UserPlaces;
