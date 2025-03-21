import React, { useState, useRef } from 'react';
import { GoogleMap, LoadScript, Autocomplete } from '@react-google-maps/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const libraries = ['places'];
const Api_Key_GooglePlaces = process.env.REACT_APP_Api_Key_googlePlaces;

const SearchLocation = ({ onSearch }) => {
    const [query, setQuery] = useState('');
    const autocompleteRef = useRef(null);

    const handlePlaceChanged = () => {
        const place = autocompleteRef.current.getPlace();
        if (place && place.formatted_address) {
            setQuery(place.formatted_address);
            if (onSearch) {
                onSearch(place.formatted_address);
            }
        }
    };

    return (
        <LoadScript
            googleMapsApiKey={Api_Key_GooglePlaces}
            libraries={libraries}
        >
            <form className="search-location-form" onSubmit={(e) => e.preventDefault()}>
                <Autocomplete
                    onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
                    onPlaceChanged={handlePlaceChanged}
                >
                    <input
                        type="text"
                        id="search"
                        placeholder="Enter city..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </Autocomplete>
                <button type="submit" className="search-button">
                    <FontAwesomeIcon icon={faSearch} />
                </button>
            </form>
        </LoadScript>
    );
};

export default SearchLocation;
