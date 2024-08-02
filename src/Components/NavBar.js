import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SearchLocation from './SearchLocation';

const NavBar = ({ user }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isClimateMenuOpen, setIsClimateMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleSearch = (query) => {
        navigate('/WeatherScreen', { state: { query } });
        closeMenu(); // Chiude il menu quando viene effettuata una ricerca
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
        setIsClimateMenuOpen(false);
    };

    const toggleClimateMenu = () => {
        setIsClimateMenuOpen(!isClimateMenuOpen);
    };

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <Link to="/" className="navbar-brand">WAPA</Link>
                <button className="navbar-toggle" onClick={toggleMenu}>
                    <span className="navbar-toggle-icon"></span>
                </button>
            </div>
            <div className="navbar-center">
                {/* Aggiungi gli altri link qui se necessario */}
            </div>
            <div className="navbar-right">
                <div className="navbar-link" onMouseEnter={toggleClimateMenu} onMouseLeave={() => setIsClimateMenuOpen(false)}>
                    Climate
                    <span className="dropdown-arrow">▼</span>
                    {isClimateMenuOpen && (
                        <div className="dropdown-menu">
                            <Link to="/WeatherScreen" className="dropdown-link" onClick={closeMenu}>Weather</Link>
                            <Link to="/AdvancedScreen" className="dropdown-link" onClick={closeMenu}>Advanced</Link>
                        </div>
                    )}
                </div>
                <SearchLocation onSearch={handleSearch} />
                {user ? (
                    <Link to="/UserProfileScreen" className="navbar-profile">Profile</Link>
                ) : (
                    <Link to="/SignUpScreen" className="navbar-signup">Sign Up</Link>
                )}
            </div>
            <div className={`navbar-menu ${isMenuOpen ? 'open' : ''}`}>
                <div className="navbar-center-menu">
                    <Link to="/WeatherScreen" className="dropdown-link" onClick={closeMenu}>Weather</Link>
                    <Link to="/AdvancedScreen" className="dropdown-link" onClick={closeMenu}>Advanced</Link>
                </div>
                <div className="navbar-right-menu">
                    <SearchLocation onSearch={handleSearch} />
                    {user ? (
                        <Link to="/UserProfileScreen" className="navbar-profile" onClick={closeMenu}>Profile</Link>
                    ) : (
                        <Link to="/SignUpScreen" className="navbar-signup" onClick={closeMenu}>Sign Up</Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
