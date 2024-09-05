import React, { useState } from "react";
import AstronomicImage from "../Components/Api_Img/AstronomicImage";
import "../Styles/style_advancedscreen.css";

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
                            Explore the universe with real-time data.<br />
                            Uncover the secrets of the cosmos and what happens  in the Earth.<br />
                            
                        </h2>
                    </div>
                    <div>
                        <div id="button-area">
                            <div className="button-area">
                                <button className="btn arrow-button">
                                    <a id="see" href="#about-area">See more</a>
                                    <span className="arrow"></span>
                                </button>
                            </div>
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

                <div id="celestial" className="event-item">
                    <h3 id="event-title" className="data-title">Celestial<br></br>events</h3>
                    <CelestialEvents />
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
                    <NearEarthObjects />
                </div>
            </section>
            <section id="four-container">

                <div id="timeline" >
                    <SpaceWeatherTimeline />
                </div>
                <div id="mars" className="event-item">
                    <h3 className="data-title">Mars Rover Photos, Rover Curiosity</h3>
                    <MarsRoverPhotos />
                </div>


            </section>

        </>
    );
}

export default AdvancedScreen;
