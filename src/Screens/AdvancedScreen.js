import React, { useState, useEffect } from "react";
/* Componenti */
import NavBar from "../Components/NavBar";
import EarthImage from "../Components/Api_Img/EarthImage";
import Footer from "../Components/Footer";

/* Stili, animazioni */
import "../Styles/style_advancedscreen.css";
import "../Styles/style_navbar.css";
import { Lottie } from 'lottie-react';
import animationData from "../Animations/Animation - 1720795288441.json";

const AdvancedScreen = () => {
    const [loading, setLoading] = useState(true);
    const [backgroundImageUrl, setBackgroundImageUrl] = useState('');

    useEffect(() => {
        if (backgroundImageUrl) {
            setLoading(false);
        }
    }, [backgroundImageUrl]);

    return (
        <>
            <section
                id="advanced-intro"
                className="container-data"
                style={{
                    height: `100vh`,
                    display: `flex`,
                    flexDirection: `column`,
                    alignItems: `center`,
                    justifyContent: `center`,
                    backgroundImage: backgroundImageUrl ? `url(${backgroundImageUrl})` : 'none',
                    backgroundSize: 'contain', // Cambiato da 'cover' a 'contain'
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center center', // Centra l'immagine
                }}
            >
                <section className="mini-container">
                    <div id="advanced-title">
                        {loading ? (
                            <Lottie
                                options={{
                                    animationData: animationData,
                                    loop: true,
                                    autoplay: true,
                                }}
                                style={{ width: 500, height: 500 }}
                            />
                        ) : (
                            <>
                                <div id="area-title">
                                    <h1 className="title">See NASA datas of today about</h1>
                                    <h1 className="title">sun & the moon.</h1>
                                </div>
                                <div id="planet-button-area">
                                    <button id="sun-btn">
                                        <a className="btn-planet" href="#about-area">Sun</a>
                                    </button>
                                    <button id="moon-btn">
                                        <a className="btn-planet" href="#about-area">Moon</a>
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </section>
            </section>
        </>
    );
}

export default AdvancedScreen;
