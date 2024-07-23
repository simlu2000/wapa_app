import './Styles/style_homescreen.css';
import './Styles/style_navbar.css';
import './Styles/style_footer.css';
import React, { useState, useEffect } from "react";
import { auth } from './Utils/firebase';
import NavBar from "./Components/NavBar";
import Footer from "./Components/Footer";
import HomeScreen from "./Screens/HomeScreen";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import WeatherScreen from './Screens/WeatherScreen';
import AdvancedScreen from './Screens/AdvancedScreen';
import SignUpScreen from './Screens/SignUpScreen';
import PrivacyPolicesScreen from './Screens/PrivacyPolicesScreen';

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className='App'>
      <Router>
        <NavBar user={user} />
        <div className='main-content'>
          <Routes>
            <Route path='/' element={<HomeScreen />} />
            <Route path='/WeatherScreen' element={<WeatherScreen />} />
            <Route path='/AdvancedScreen' element={<AdvancedScreen />} />
            <Route path='/SignUpScreen' element={<SignUpScreen />} />
            <Route path='/PrivacyPolicesScreen' element={<PrivacyPolicesScreen />} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
