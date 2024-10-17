import React, { useState, useEffect } from "react";
import AstronomicImage from "../Components/Api_Img/AstronomicImage";
import "../Styles/style_advancedscreen.css";
import SpaceWeatherTimeline from "../Components/Charts/SpaceWeatherTimeline";
import CelestialEvents from "../Components/Advanced/CelestialEvents";
import NaturalEvents from "../Components/Charts/NaturalEvents";
import MarsRoverPhotos from "../Components/Api_Img/MarsRoverPhotos";
import NearEarthObjects from "../Components/Advanced/NearEarthObjects";
import EarthImage from "../Components/Api_Img/EarthImage";
import animationData from '../Animations/Animation - 1726519636363.json';
import Lottie from 'react-lottie';
import LunarPhases from "../Components/Advanced/LunarPhases";
import "../Styles/style_lunarphases.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEarth, faStar } from '@fortawesome/free-solid-svg-icons';


const AdvancedScreen = () => {
    const [backgroundImage, setBackgroundImage] = useState(""); // Background per gestire immagine
    const [imageDate, setImageDate] = useState("");
    const [isAstronomicImage, setIsAstronomicImage] = useState(true);
    const [loading, setLoading] = useState(true);
    const [isOffline, setIsOffline] = useState(!navigator.onLine);

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };

    useEffect(() => {
        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await new Promise(resolve => setTimeout(resolve, 100)); //n'attesa di 1 secondo
                setBackgroundImage('path_to_your_image'); 
                setImageDate('Date of the image');
            } catch (error) {
                console.error("Error loading data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Funzione per alternare tra le immagini di AstronomicImage e EarthImage
    const handleSwitchImage = () => {
        setIsAstronomicImage(!isAstronomicImage);
    };

    return (
        <>
            {loading ? (
                <div className="animation-container">
                    <Lottie options={defaultOptions} height={"200px"} width={"200px"} />
                </div>
            ) : (
                <>
                    {isAstronomicImage ? (
                        <AstronomicImage setBackgroundImage={setBackgroundImage} setImageDate={setImageDate} />
                    ) : (
                        <EarthImage setBackgroundImageUrl={setBackgroundImage} />
                    )}

                    <section id="advanced-intro" style={{
                        backgroundImage: `url(${backgroundImage})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        minHeight: "100vh",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                        transition: "background-image 0.5s ease-in-out",
                        color: "#F7F7F7",
                        overflow: "auto", //scrolling
                    }}>
                        <div id="advanced-title">

                            <div id="area-title">
                                <h1 className="title">
                                    Navigate the&nbsp;
                                    <a id="universe changeBackground" onClick={handleSwitchImage} className="switch-image-button">
                                        {isAstronomicImage ? <a id="to-earth" className="title">Earth&nbsp;↻</a>
                                            : <a id="to-universe" className="title">Cosmo&nbsp;↻</a>
                                        }
                                    </a>
                                </h1>


                            </div>


                            <button id="central-button">

                                <a href="#phases" id="seeUniverse">EXPLORE</a>
                                <span className="arrow"></span>
                            </button>

                            {imageDate && (
                                <div id="image-date">
                                    <p id="date-text">{imageDate}</p>
                                </div>
                            )}
                        </div>

                    </section>
                    <div id="phases">
                        <LunarPhases />
                    </div>

                
                    <section id="second-container" className="mini-container">
                        <div id="celestial" className="event-item">
                            <h3 id="event-title" className="data-title">Celestial<br />events</h3>
                            <CelestialEvents />
                        </div>
                    </section>

                    <section id="third-container">
                        <div id="natural" className="event-item">
                            <h3 className="data-title">Natural events by category</h3>
                            <NaturalEvents />
                        </div>
                        <div id="objects">
                            <h3 className="data-title">Objects near Earth</h3>
                            <NearEarthObjects />
                        </div>

                        <div id="timeline">
                            <h3 className="data-title">Timeline of Solar Eruptions</h3>
                            <SpaceWeatherTimeline />
                        </div>
                        {/*
                        <div id="mars" className="event-item">
                            <h3 className="data-title">Mars Rover Photos, Rover Curiosity</h3>
                            <MarsRoverPhotos />
                        </div>
                        */}
                    </section>
                </>
            )}
        </>
    );
}

export default AdvancedScreen;
