import React, { useState } from "react";
import AstronomicImage from "../Components/Api_Img/AstronomicImage";
import "../Styles/style_advancedscreen.css";
import Lottie from "lottie-react-web";
import animationData from "../Animations/Animation - 1720795288441.json";
import { AnimateOnChange } from 'react-animation';
import SpaceWeatherTimeline from "../Components/Charts/SpaceWeatherTimeline";
import CelestialEvents from "../Components/Advanced/CelestialEvents";
import NaturalEvents from "../Components/Charts/NaturalEvents";
import MarsRoverPhotos from "../Components/Api_Img/MarsRoverPhotos";
import NearEarthObjects from "../Components/Advanced/NearEarthObjects";
import EarthImage from "../Components/Api_Img/EarthImage";
const AdvancedScreen = () => {
    const [backgroundImage, setBackgroundImage] = useState("");
    const [imageDate, setImageDate] = useState("");

    return (
        <>
            <AstronomicImage setBackgroundImage={setBackgroundImage} setImageDate={setImageDate} />
            <section id="advanced-intro" style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                transition: "background-image 0.5s ease-in-out",
                color: "#F7F7F7" //testo data
            }}>
                <div id="advanced-title">
                    <div id="area-title">
                        <h1 className="title">Navigate the <a id="universe-text"
                        >universe.</a></h1>
                    </div>
                    <div id="subtitle-area" className="centered-text">
                        <h2 id="subtitle">
                            Explore the universe with real-time data on the Sun and Moon.<br />
                            Uncover the secrets of the cosmos with detailed astronomical analyses.<br />
                            From solar flares to moon phases, get the latest updates and forecasts.
                        </h2>
                    </div>
                    <div>
                        <div id="button-area">
                            <button id="universe-btn">
                                <a id="universe-text" href="#second-container">
                                    Universe
                                </a>
                                <span className="arrow"></span>
                            </button>
                        </div>
                    </div>
                    {imageDate && (
                        <div id="image-date" className="image-date">
                            <p>{imageDate}</p>
                        </div>
                    )}
                </div>
            </section>

            <section id="second-container" className="mini-container">

                <div id="timeline" >
                    <h3 className="data-title">Predictions of space events and climate impacts</h3>
                    <SpaceWeatherTimeline />
                </div>
                <div id="earth" className="event-item">
                    <h3 className="data-title">Earth image of today</h3>
                    <EarthImage />
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
            </section>
            <section id="four-container">
                <div id="mars" className="event-item">
                    <h3 className="data-title">Mars Rover Photos, Rover Curiosity</h3>
                    <MarsRoverPhotos />
                </div>
                <div id="celestial" className="event-item">
                    <h3 id="event-title" className="data-title">Celestial<br></br>events</h3>
                    <CelestialEvents />
                </div>

            </section>

        </>
    );
}

export default AdvancedScreen;
