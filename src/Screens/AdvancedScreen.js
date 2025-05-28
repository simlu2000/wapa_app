import React, { useState, useEffect } from "react";
import AstronomicImage from "../Components/Api_Img/AstronomicImage";
import "../Styles/style_advancedscreen.css";
import SpaceWeatherTimeline from "../Components/Charts/SpaceWeatherTimeline";
import CelestialEvents from "../Components/Advanced/CelestialEvents";
import NaturalEvents from "../Components/Charts/NaturalEvents";
import NearEarthObjects from "../Components/Advanced/NearEarthObjects";
import EarthImage from "../Components/Api_Img/EarthImage";
import LunarPhases from "../Components/Advanced/LunarPhases";
import "../Styles/style_lunarphases.css";
import Loader from "../Components/loader";
import { Button } from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

const AdvancedScreen = () => {
    const [backgroundImage, setBackgroundImage] = useState("");
    const [imageDate, setImageDate] = useState("");
    const [isAstronomicImage, setIsAstronomicImage] = useState(true);
    const [loading, setLoading] = useState(true);
    const [isOffline, setIsOffline] = useState(!navigator.onLine);


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
                <div className="loader-area">
                    <Loader />
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
                            <div id="area-title" onClick={handleSwitchImage} className="switch-image-button">
                                <h1 className="title">
                                    {isAstronomicImage ? (
                                        <>Explore the Earth👆</>
                                    ) : (
                                        <>Explore the Cosmo👆</>
                                    )}
                                </h1>


                            </div>


                            <section id="central-button" >
                                <Button
                                    variant="contained"
                                    color="primary"
                                    href="#phases"
                                    endIcon={<ArrowDownwardIcon />}
                                    id="secondary"
                                    sx={{
                                        textTransform: 'uppercase',
                                        fontWeight: 'bold',
                                        paddingX: 4,
                                        paddingY: 0.5,
                                    }}
                                >
                                    EXPLORE
                                </Button>
                            </section>
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
