import React, { useState } from "react";
import NavBar from "../Components/NavBar";
import AstronomicImage from "../Components/Api_Img/AstronomicImage";
import Footer from "../Components/Footer";
import "../Styles/style_advancedscreen.css";
import "../Styles/style_navbar.css";
import Lottie from "lottie-react-web";
import animationData from "../Animations/Animation - 1720795288441.json";
import { AnimateOnChange } from 'react-animation';

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
                        <h1 className="title">Navigate the <AnimateOnChange
                            animationIn="bounceIn"
                            animationOut="bounceOut"
                            durationOut={1000}
                        >universe.</AnimateOnChange></h1>
                    </div>
                    <div id="subtitle-area" className="centered-text">
                        <h2 id="subtitle">
                            Explore the universe with real-time data on the Sun and Moon.<br />
                            Uncover the secrets of the cosmos with detailed astronomical analyses.<br />
                            From solar flares to moon phases, get the latest updates and forecasts.
                        </h2>
                    </div>
                    {imageDate && (
                        <div id="image-date" className="image-date">
                            <p>{imageDate}</p>
                        </div>
                    )}
                </div>
            </section>

            <section id="second-container" className="mini-container">
                {}
            </section>
        </>
    );
}

export default AdvancedScreen;
