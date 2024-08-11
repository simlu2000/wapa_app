import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faInfoCircle, faCloudSun, faUser, faUserPlus, faSearch, faRocket, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import SearchLocation from './SearchLocation';
import '../Styles/style_sidebar.css';

const SideBar = ({ user }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (query) => {
    navigate('/WeatherScreen', { state: { query } });
    closeMenu();
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

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

          {isMenuOpen ? (
            <SearchLocation onSearch={handleSearch} />
          ) : (
            <div className="sidebar-link">
              <FontAwesomeIcon icon={faSearch} />
            </div>
          )}

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
        </div>
      </aside>
    </>
  );
};

export default SideBar;
