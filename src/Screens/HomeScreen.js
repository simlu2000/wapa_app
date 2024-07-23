import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useInView } from "react-intersection-observer";
/* Components */
import EarthImage from "../Components/Api_Img/EarthImage";
import SunImage from "../Components/Api_Img/SunImage";
import UnsplashFetching from "../Components/Api_Img/UnsplashFetching";
/* Styles */
import "animate.css";
import "../Styles/style_homescreen.css";
/* Images */
import sun from "../img/sun.png";
import mapsLogo from "../img/mapsLogo.png";
import locationLogo from "../img/locationLogo.png";
import alarmLogo from "../img/alarmLogo.png";

const HomeScreen = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState("");

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  useEffect(() => {
    if (inView) {
      setIsVisible(true);
    }
  }, [inView]);

  return (
    <>
      <UnsplashFetching setBackgroundImage={setBackgroundImage} />

      <section
        id="intro"
        className="container-data"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          transition: "background-image 0.5s ease-in-out",
        }}
      >
        <div className="mini-container">
          <div id="title-area">
            <h1>
              Exact
              <img src={sun} className="sun-icon" alt="sun icon" />
              weather
            </h1>
            <h1 className="title" id="title2">
              exactly for you.
            </h1>
          </div>
          <div id="button-area">
            <button className="btn arrow-button">
              <a id="see" href="#about-area">
                See more
              </a>
              <span className="arrow"></span>
            </button>
          </div>
        </div>
      </section>

      <section id="about-area" className="container-data">
        <div id="about">
          <h2 id="small-text1">Stay up to date on the</h2>
          <div id="wapa-title">
            <h1 id="big-text">Weather</h1>
          </div>
          <h2 id="small-text2">and know a lot of things.</h2>
        </div>

        <div id="things" className="container-data">
          <InfoBox
            title="Weather in one click"
            text="Insert your location and instantly discover all the essential weather information like temperature, pressure, humidity, and much more. Not just numbers, but also colorful charts that make everything clearer and easier to look at!"
            imgSrc={locationLogo}
            imgAlt="Location Logo"
          />
          <InfoBox
            title="Galactic predictions"
            text="Aren't you satisfied with the usual predictions? Then get ready for something spacey! Thanks to the NASA API, our web app offers you advanced predictions with super detailed data about the sun and the moon. Graphs and charts will reveal every secret of the sky!"
            customComponent={<EarthImage />}
          />
          <InfoBox
            title="Interactive maps"
            text="Forget the old weather reports. With our interactive maps, you can see real-time data on earthly heat, sea level pressure, precipitation, and much more. It's like having a personal satellite!"
            imgSrc={mapsLogo}
            imgAlt="Maps Logo"
          />
          <InfoBox
            title="Customize your experience"
            text="If you sign in, you'll have the possibility to add your favorite locations and see the weather you're interested in directly. And if you want to always be one step ahead, turn on weather notifications so you'll never get caught unprepared by a storm!"
            imgSrc={alarmLogo}
            imgAlt="Alarm Logo"
          />
        </div>

        <div id="call-to-action-area">
          <h2 id="call-to-action-text">🚀Join WAPA Today!🚀</h2>
          <h3 id="call-to-action-text2">
            Become part of our community and gain instant access to your <br />
            favorite places, advanced predictions and customizable experience.
            <br /> 💡Don't wait! Your new WAPA experience starts here💡
          </h3>
          <button id="call-to-action-btn">
            <Link to="/SignUpScreen">JOIN US!</Link>
          </button>
        </div>
      </section>
    </>
  );
};

const InfoBox = ({ title, text, imgSrc, imgAlt, customComponent }) => (
  <div className="info-box">
    <div className="mini-container left">
      <h1 className="info-box-test">{title}</h1>
      <p className="info">{text}</p>
    </div>
    <div className="mini-container right">
      {customComponent || <img src={imgSrc} alt={imgAlt} className="info-img" />}
    </div>
  </div>
);

export default HomeScreen;
