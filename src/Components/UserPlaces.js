import React, { useState, useEffect, useRef } from 'react';
import '../Styles/style_userplaces.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faRemove } from '@fortawesome/free-solid-svg-icons';

// Accessing the API key from environment variables
const Api_Key_GooglePlaces = process.env.REACT_APP_Api_Key_googlePlaces;

const UserPlaces = ({ weatherData, userId, onAddLocation, onRemoveLocation, onSelectLocation, getUserLocalities: fetchUserLocalities }) => {
    const [localities, setLocalities] = useState([]);
    const [newLocation, setNewLocation] = useState('');
    const inputRef = useRef(null); 

    useEffect(() => {
        const loadGoogleMapsScript = () => {
            if (!window.google) {
                const script = document.createElement('script');
                
                // Correctly injecting the API key into the URL
                script.src = `https://maps.googleapis.com/maps/api/js?key=${Api_Key_GooglePlaces}&libraries=places`;  // Correct template literal usage
                script.async = true;
                script.defer = true;
                script.onload = () => {
                    // Initialize autocomplete after the script is loaded
                    if (inputRef.current) {
                        const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
                            types: ['(cities)'], // Limit the suggestions to cities
                            componentRestrictions: { country: 'IT' }, // Restrict to Italy if needed
                        });

                        autocomplete.addListener("place_changed", () => {
                            const place = autocomplete.getPlace();
                            if (place && place.formatted_address) {
                                setNewLocation(place.formatted_address); // Set the input value to the selected place
                            }
                        });
                    }
                };
                document.head.appendChild(script);
            }
        };

        loadGoogleMapsScript();
    }, []); // Only run once when component is mounted

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
                setNewLocation(''); // Clear the input field after adding
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

    return (
        <section className="user-places-container">
            <input
                type="text"
                id="fav-insert"
                className="new-loc"
                ref={inputRef}
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                placeholder="Add new location"
            />
            <button
                id="add-loc"
                onClick={handleAddClick}
                disabled={localities.length >= 6}
            >
                <FontAwesomeIcon icon={faAdd} style={{ color: "#F7F7F7" }} />
            </button>
            <ul>
                {localities.map((loc) => (
                    <li key={loc.toUpperCase()}>
                        <button id="location" className="btn-loc" onClick={() => onSelectLocation(loc)}>
                            {loc}
                            <FontAwesomeIcon icon={faRemove} style={{ color: "red", marginLeft: '5%', fontSize: '1rem' }} onClick={() => handleRemoveClick(loc)} />
                            <hr />
                        </button>
                    </li>
                ))}
            </ul>
        </section>
    );
};

export default UserPlaces;
