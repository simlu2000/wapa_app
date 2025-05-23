import React, { useState, useEffect, startTransition } from "react";
import { Link } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import CloudBackground from "../Animations/CloudBackground";
import "animate.css";
import "../Styles/style_homescreen.css";
import logo from "../img/logo.png";
import locationLogo from "../img/locationLogo.png";
import { Button } from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

function isMobileDevice() {
  return /Mobi|Android/i.test(navigator.userAgent) || window.innerWidth <= 768;
}


const useNetworkStatus = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => setIsOffline(false);

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  return isOffline;
};

const HomeScreen = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.5 });
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const isOffline = useNetworkStatus();

  useEffect(() => {
    setIsMobile(isMobileDevice());
  }, []);

  useEffect(() => {
    if (inView) {
      startTransition(() => {
        setIsVisible(true);
      });
    }
  }, [inView]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      console.log("Loading complete");
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    console.log("State Changes:", { isMobile, isOffline, inView, isVisible });
  }, [isMobile, isOffline, inView, isVisible]);

  return (
    <>
      <section id="intro" className="weather-container">
        <div id="title-logo-container" className="content">
          {!isOffline ? (
            <CloudBackground />
          ) : (
            <div className="gradient-fallback">
              <h1>You are offline. Some features may not be available.</h1>
            </div>
          )}
        </div>
      </section>

      <section id="discover-btn-area" className="button-area">
        <Button
          variant="contained"
          color="primary"
          href="#about-area"
          endIcon={<ArrowDownwardIcon />}
          id="secondary"
          sx={{
            textTransform: 'uppercase',
            fontWeight: 'bold',
            paddingX: 4,
            paddingY: 0.5,
          }}
        >
          Discover
        </Button>
      </section>

      <section id="about-area" className="container-data">
        <div>
          <h1 id="features-title">Our Features</h1>
          <h2 id="features-subtitle">Stay connected to be updated</h2>
        </div>

        <div id="things" className="info-box-container">
          <div className="info-box-small">
            <WapaBox
              imgSrc={logo}
              title="W-A-P-A"
              text="Weather Advanced Predictions App. With Wapa you will be updated about all weather conditions and advanced informations about the universe. See our climatic features and enjoy all your days with us!"
              loading="lazy"
            />
            <InfoBox
              title="Weather in one click"
              text="WAPA provides all the weather information you need in an instant. Simply enter your location and instantly discover essential data like temperature, pressure, humidity, wind speed, and much more."
            />
          </div>
          <div className="info-box-small">
            <WapaBox
              imgSrc={locationLogo}
              title="Locations"
              text="Join us and add (with a max of six) or remove your favorites locations directly from the weather screen or your reserved page. Then with only a click in one city you can see a lot of informations!"
              loading="lazy"
            />
            <InfoBox
              title="Galactic predictions"
              text="Using data directly from NASA's API, our web app delivers advanced predictions with incredibly detailed insights about natural events and the universe, like celestial events. You also can watch some daily photos about Mars and the Earth!"
            />
          </div>
        </div>

        <div id="call-to-action-area">
          <h2 id="call-to-action-text">Join WAPA!🚀</h2>
          <h3 id="call-to-action-text2">
            Become part of our community and gain instant access to your favorite places, advanced predictions, and a customizable experience.<br />
            Don't wait! Your new weather experience starts here 💡
            <div id="signup-area">
              <Button
                variant="contained"
                color="primary"
                endIcon={<ArrowRightIcon />}
                id="secondary"
                sx={{
                  textTransform: 'uppercase',
                  fontWeight: 'bold',
                  paddingX: 4,
                  paddingY: 0.5,
                }}
              >
                <p><Link to="/SignUpScreen">Sign up</Link></p>
              </Button>
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
