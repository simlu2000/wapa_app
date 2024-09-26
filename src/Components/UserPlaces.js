import React, { useState, useEffect } from 'react';
import '../Styles/style_userplaces.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faRemove } from '@fortawesome/free-solid-svg-icons';

const UserPlaces = ({ weatherData, userId, onAddLocation, onRemoveLocation, onSelectLocation, getUserLocalities: fetchUserLocalities }) => {
    const [localities, setLocalities] = useState([]);
    const [newLocation, setNewLocation] = useState('');

    useEffect(() => {
        const fetchLocalities = async () => {
            try {
                const localitiesList = await fetchUserLocalities(userId);
                setLocalities(localitiesList);
            } catch (error) {
                console.error("Error fetching localities:", error);
            }
        };

        if (userId) {
            fetchLocalities();
        }
    }, [userId, fetchUserLocalities]);

    const handleAddClick = async () => {
        if (newLocation && localities.length < 6) {
            try {
                await onAddLocation(newLocation);
                const updatedLocalities = await fetchUserLocalities(userId);
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
            const updatedLocalities = await fetchUserLocalities(userId);
            setLocalities(updatedLocalities);
        } catch (error) {
            console.error("Error removing location:", error);
        }
    };

    useEffect(() => {
        console.log('UserPlaces props:', { userId, onAddLocation, onRemoveLocation, onSelectLocation });
    }, [userId, onAddLocation, onRemoveLocation, onSelectLocation]);

    return (
        <section className="user-places-container">
            <h2 id="fav-text">Your Favorite Places</h2>
            <input
                type="text"
                id="fav-insert"
                className="new-loc"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                placeholder="Add new location"
            />
            <button
                className="add-loc"
                onClick={handleAddClick}
                disabled={localities.length >= 6}
            >
                <FontAwesomeIcon icon={faAdd} style={{ color: "#F7F7F7" }} />
            </button>
            <ul>
                {localities.map((loc) => (
                    <li key={loc}>
                        <button id="location" className="btn-loc" onClick={() => onSelectLocation(loc)}>
                            {loc}
                        </button>
                        <button className="btn-del" id="bt1" onClick={() => handleRemoveClick(loc)}>
                            <FontAwesomeIcon icon={faRemove} style={{ color: "#F7F7F7" }} />
                        </button>
                    </li>
                ))}
            </ul>
        </section>
    );
};

export default UserPlaces;
