import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useInView } from "react-intersection-observer";
/* Components */
import UnsplashFetching from "../Components/Api_Img/UnsplashFetching";
import Footer from "../Components/Footer";
/* Styles */
import "animate.css";
import "../Styles/style_homescreen.css";
/* Images */
import locationLogo from "../img/locationLogo.png";
import alarmLogo from "../img/alarmLogo.png";
import earth from "../img/earth.png";

const HomeScreen = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.5 });

  useEffect(() => {
    if (inView) setIsVisible(true);
  }, [inView]);

  return (
    <>
      <UnsplashFetching setBackgroundImage={() => {}} />

      <section id="intro" className="container-data">
        <div id="title-logo-container">
          <div id="title-area">
            <h1 id="title">Exact weather 🌅<br />exactly for you</h1>
            <h2 id="subtitle">And know a lot of things</h2>
          </div>
        </div>

        <div className="mini-container">
          <div className="button-area">
            <button className="btn arrow-button">
              <a id="see" href="#about-area">Discover</a>
              <span className="arrow"></span>
            </button>
          </div>
        </div>
      </section>

      <section id="about-area" className="container-data">
        <div>
          <h1 id="features-title">Our Features</h1>
          <h2 id="features-subtitle">Stay connect to see new features in future</h2>
        </div>

        <div id="things" className="info-box-container">
          <div className="info-box-large">
            <InfoBox
              title="Weather in one click"
              text="WAPA provides all the weather information you need in an instant. Simply enter your location and instantly discover essential data like temperature, pressure, humidity, wind speed, and much more."
              imgSrc={locationLogo}
              imgAlt="Location Logo"
            />
          </div>
          <div className="info-box-small">
            <InfoBox
              title="Galactic predictions"
              text="Using data directly from NASA's API, our web app delivers advanced predictions with incredibly detailed insights about natural events and the universe, like celestial events. You also can watch some daily photos about Mars and the Earth!"
              //imgSrc={earth}
              //imgAlt="Earth"
            />
            <InfoBox
              title="Customize your experience"
              text="Sign in to add your favorite locations (1-6) and see weather updates directly. Turn on weather notifications to stay prepared for any weather alarm like strange temperature or thunderstorm."
              //imgSrc={alarmLogo}
              //imgAlt="Alarm Logo"
            />
          </div>
        </div>

        <div id="call-to-action-area">
          <h2 id="call-to-action-text">🚀 Join WAPA Today! 🚀</h2>
          <h3 id="call-to-action-text2">
            Become part of our community and gain instant access to your favorite places, advanced predictions, and customizable experience.<br />
            💡 Don't wait! Your new WAPA experience starts here 💡
          </h3>
          <div className="button-area">
            <button className="btn arrow-button">
              <a id="see" href="#about-area"><Link to="/SignUpScreen">Join us!</Link></a>
              <span className="arrow"></span>
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

const InfoBox = ({ title, text, imgSrc, imgAlt }) => (
  <div className="info-box">
    <div className="mini-container left">
      <h1 className="info-box-test">{title}</h1>
      <p className="info">{text}</p>
    </div>
    <div className="mini-container right">
      <img src={imgSrc} alt={imgAlt} className="info-img" loading="lazy" />
    </div>
  </div>
);

export default HomeScreen;
