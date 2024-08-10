import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useInView } from "react-intersection-observer";
/* Components */
import EarthImage from "../Components/Api_Img/EarthImage";
import SunImage from "../Components/Api_Img/SunImage";
import UnsplashFetching from "../Components/Api_Img/UnsplashFetching";
import Footer from "../Components/Footer";
/* Styles */
import "animate.css";
import "../Styles/style_homescreen.css";
import "../Styles/style_footer.css";
/* Images */
import sun from "../img/sun.png";
import mapsLogo from "../img/mapsLogo.png";
import locationLogo from "../img/locationLogo.png";
import alarmLogo from "../img/alarmLogo.png";
import earth from "../img/earth.png";
import logo from "../img/logo.png"; // Aggiunta del logo

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
          
        }}
      >
        <div id="title-logo-container">
          <div id="title-area">
            <h1 id="title">
              Exact weather exactly for you.
            </h1>
          </div>
          <div id="logo-area">
            <img src={logo} alt="Logo" id="logo" />
          </div>
        </div>

        <div className="mini-container">
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
            text=" WAPA provides all the weather information you need in an instant. Simply enter your location and instantly discover essential data like temperature, pressure, humidity, wind speed, and much more. Not just numbers, but also interactive and colorful charts that make understanding the weather easy and enjoyable! Every detail is presented intuitively to help you plan your day better, whether you're organizing a vacation, an outdoor activity, or just deciding what to wear."
            imgSrc={locationLogo}
            imgAlt="Location Logo"
          />
          <InfoBox
            title="Galactic predictions"
            text="Ready for something beyond the ordinary? If traditional weather forecasts aren't cutting it, prepare for a cosmic upgrade! Using data directly from NASA's API, our web app delivers advanced predictions with incredibly detailed insights about the sun and celestial events. Explore the sky like never before with charts that unveil the mysteries of the cosmos!"
            imgSrc={earth}
            imgAlt="Earth"
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
      {customComponent || <img src={imgSrc} alt={imgAlt} className="info-img" loading="lazy" />}
    </div>
  </div>
);

export default HomeScreen;
