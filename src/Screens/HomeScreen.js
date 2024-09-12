import React, { useState, useEffect, startTransition } from "react";
import { createContext, useContext, useRef } from 'react';

import { Link } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import Footer from "../Components/Footer";
import CloudBackground from "../Animations/CloudBackground"; // Importa il componente
import "animate.css";
import "../Styles/style_homescreen.css";
import logo from "../img/logo.png";
import locationLogo from "../img/locationLogo.png";
import alarmLogo from "../img/alarmLogo.png";
import earth from "../img/earth.png";

import { Canvas } from "@react-three/fiber";
import { Clouds, Cloud, Sky as SkyImpl } from "@react-three/drei";

const HomeScreen = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.5 });

  useEffect(() => {
    if (inView) {
      startTransition(() => {
        setIsVisible(true);
      });
    }
  }, [inView]);

  return (
    <>
      <section id="intro" className="weather-container">

        <div id="title-logo-container" className="content">
          <CloudBackground />
        </div>
      </section>

      <section id="discover-btn-area" className="button-area">
        <button id="dsc-btn" className="btn arrow-button">
          <div id="see" href="#about-area">
            <a href="about-area">DISCOVER</a>
          </div>
          <span className="arrow"></span>
        </button>
      </section>

      <section id="about-area" className="container-data">
        <div>
          <h1 id="features-title">Our Features</h1>
          <h2 id="features-subtitle">Stay connected to see new features in the future</h2>
        </div>

        <div id="things" className="info-box-container">
          <div className="info-box-small">
            <WapaBox
              imgSrc={logo}
              title="W-A-P-A"
              text="Weather Advanced Predictions App. With Wapa you will be updated about all weather conditions and advanced info about the universe. See here our climatic features and enjoy your days with us!"
            />
            <InfoBox
              title="Weather in one click"
              text="WAPA provides all the weather information you need in an instant. Simply enter your location and instantly discover essential data like temperature, pressure, humidity, wind speed, and much more."
            />
          </div>
          <div className="info-box-small">
            <WapaBox
              imgSrc={alarmLogo}
              title="Notifications"
              text="Sign in to add your favorite locations (1-6) and see weather updates directly. Turn on weather notifications to stay prepared for any weather alarms like strange temperatures or thunderstorms."
            />
            <InfoBox
              title="Galactic predictions"
              text="Using data directly from NASA's API, our web app delivers advanced predictions with incredibly detailed insights about natural events and the universe, like celestial events. You also can watch some daily photos about Mars and the Earth!"
            />
          </div>
        </div>

        <div id="call-to-action-area">
          <h2 id="call-to-action-text">🚀 Join WAPA Today! 🚀</h2>
          <h3 id="call-to-action-text2">
            Become part of our community and gain instant access to your favorite places, advanced predictions, and a customizable experience.<br />
            💡 Don't wait! Your new WAPA experience starts here 💡
            <div id="see" href="#about-area">
                <Link to="/SignUpScreen">Join us!</Link>
              </div>
          </h3>
           
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
    {imgSrc && (
      <div className="mini-container right">
        <img src={imgSrc} alt={imgAlt} className="info-img" loading="lazy" />
      </div>
    )}
  </div>
);

const WapaBox = ({ title, text, imgSrc, imgAlt }) => (
  <div className="info-box">
    {imgSrc && (
      <div>
        <img src={imgSrc} alt={imgAlt} className="logo" loading="lazy" />
        <h2 className="info-box-test">{title}</h2>
        <p className="info">{text}</p>
      </div>
    )}
  </div>
);

export default HomeScreen;
