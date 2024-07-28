import React from "react";
import { Link, useLocation } from "react-router-dom";
import { auth } from '../Utils/firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';

export const NavBar = ({ user }) => {
    const location = useLocation();

    return (
        <nav className="nav">
            <div className="navbar-container">
                <header className="nav-header">
                    <h3 className="wapa-area"><Link to="/">WAPA</Link></h3>
                    <h3 className="opt" id="opt1">
                        <Link to="/WeatherScreen" className={`opt ${location.pathname === '/WeatherScreen' ? 'active' : ''}`}>
                            Weather
                        </Link>
                    </h3>
                    <h3 className="opt">
                        <Link to="/AdvancedScreen" className={`opt ${location.pathname === '/AdvancedScreen' ? 'active' : ''}`}>
                            Advanced
                        </Link>
                    </h3>
                    {!user ? ( //se non ce utente loggato
                        <button className="opt btn-user">
                            <Link to="/SignUpScreen" className={`opt ${location.pathname === '/SignUpScreen' ? 'active' : ''}`}>
                                Sign Up
                            </Link>
                        </button>
                    ) : ( //altrimenti ce utente
                        /*<button className="logout-button btn-user" onClick={() => auth.signOut()}>
                            Sign Out
                        </button>*/
                        <section id="user-area">
                            <button id="profile-btn" className="Logout-button btn-user"><Link to="/UserProfileScreen"><FontAwesomeIcon icon={faUserCircle}/></Link></button>
                        </section>
                    )}
                </header>
            </div>
        </nav>
    );
};

export default NavBar;
