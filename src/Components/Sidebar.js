import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SearchLocation from './SearchLocation';
import '../Styles/style_sidebar.css';

const SideBar = ({ user }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isClimateMenuOpen, setIsClimateMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (query) => {
    navigate('/WeatherScreen', { state: { query } });
    closeMenu();
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
    <>
      <button className="sidebar-toggle" onClick={toggleMenu}>
        ☰
      </button>
      <aside className={`sidebar ${isMenuOpen ? 'open' : ''}`}>
        <Link to="/" className="sidebar-brand" onClick={closeMenu}>WAPA</Link>
        <Link to="/AboutScreen" className="sidebar-link" onClick={closeMenu}>About</Link>
        <Link to="/WeatherScreen" className="sidebar-link" onClick={closeMenu}>Weather</Link>
        <Link to="/AdvancedScreen" className="sidebar-link" onClick={closeMenu}>Advanced</Link>
        <SearchLocation onSearch={handleSearch} />
        {user ? (
          <Link to="/UserProfileScreen" className="sidebar-link btn-sidebar" onClick={closeMenu}>Profile</Link>
        ) : (
          <Link to="/SignUpScreen" className="sidebar-link btn-sidebar" onClick={closeMenu}>Sign Up</Link>
        )}
      </aside>
    </>
  );
};

export default SideBar;
