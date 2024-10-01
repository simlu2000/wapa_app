import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faInfoCircle, faCloudSun, faUser, faUserPlus, faSearch, faRocket, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import SearchLocation from './SearchLocation';
import '../Styles/style_sidebar.css';
import UserPlaces from './UserPlaces';
import { addLocation, removeLocation, getUserLocalities } from '../Utils/userService';

const SideBar = ({ user }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [localities, setLocalities] = useState([]);


  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleAddLocation = async (location) => {
    if (user) {
      try {
        await addLocation(user.uid, location);
        const updatedLocalities = await getUserLocalities(user.uid);
        setLocalities(updatedLocalities);
      } catch (error) {
        console.error("Error adding location:", error);
      }
    }
  };

  const handleRemoveLocation = async (location) => {
    if (user) {
      try {
        await removeLocation(user.uid, location);
        const updatedLocalities = await getUserLocalities(user.uid);
        setLocalities(updatedLocalities);
      } catch (error) {
        console.error("Error removing location:", error);
      }
    }
  };

  const handleSelectLocation = (location) => {
    navigate('/WeatherScreen', { state: { query: location } });
    closeMenu();
  };

  useEffect(() => {
    const fetchLocalities = async () => {
      if (user) {
        try {
          const localitiesList = await getUserLocalities(user.uid);
          setLocalities(localitiesList);
        } catch (error) {
          console.error("Error fetching localities:", error);
        }
      }
    };

    fetchLocalities();
  }, [user]);

  return (
    <>
      <section id="toggle-area">
        <button className="sidebar-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} />
        </button>
      </section>
      <aside
        className={`sidebar ${isMenuOpen ? 'open' : ''}`}
        onMouseEnter={() => setIsMenuOpen(true)}
        onMouseLeave={() => setIsMenuOpen(false)}
      >
        <div className="sidebar-content">
          <Link to="/" className="sidebar-link" onClick={closeMenu}>
            <FontAwesomeIcon icon={faHome} />
            {isMenuOpen && <span>Home</span>}
          </Link>
          <Link to="/AboutScreen" className="sidebar-link" onClick={closeMenu}>
            <FontAwesomeIcon icon={faInfoCircle} />
            {isMenuOpen && <span>About</span>}
          </Link>
          <Link to="/WeatherScreen" className="sidebar-link" onClick={closeMenu}>
            <FontAwesomeIcon icon={faCloudSun} />
            {isMenuOpen && <span>Weather</span>}
          </Link>
          <Link to="/AdvancedScreen" className="sidebar-link" onClick={closeMenu}>
            <FontAwesomeIcon icon={faRocket} />
            {isMenuOpen && <span>Advanced</span>}
          </Link>


          {user ? (
            <Link to="/UserProfileScreen" className="sidebar-link" onClick={closeMenu}>
              <FontAwesomeIcon icon={faUser} />
              {isMenuOpen && <span>Profile</span>}
            </Link>
          ) : (
            <Link to="/SignUpScreen" className="sidebar-link" onClick={closeMenu}>
              <FontAwesomeIcon icon={faUserPlus} />
              {isMenuOpen && <span>Sign Up</span>}
            </Link>
          )}

          {user && (
            <section id="user-places" className="sidebar-link">
              <UserPlaces
                userId={user.uid}
                onAddLocation={handleAddLocation}
                onRemoveLocation={handleRemoveLocation}
                onSelectLocation={handleSelectLocation}
                getUserLocalities={getUserLocalities}
                weatherData={null} // Pass `weatherData` if needed
              />
            </section>
          )}
        </div>
      </aside>
    </>
  );
};

export default SideBar;
