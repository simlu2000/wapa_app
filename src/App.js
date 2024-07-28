import './Styles/style_homescreen.css';
import './Styles/style_navbar.css';
import './Styles/style_footer.css';
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { auth } from './Utils/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { addLocation, removeLocation, getUserLocalities } from './Utils/userService';

import NavBar from "./Components/NavBar";
import Footer from "./Components/Footer";
import HomeScreen from "./Screens/HomeScreen";
import WeatherScreen from './Screens/WeatherScreen';
import AdvancedScreen from './Screens/AdvancedScreen';
import SignUpScreen from './Screens/SignUpScreen';
import PrivacyPolicesScreen from './Screens/PrivacyPolicesScreen';
import UserProfileScreen from './Screens/UserProfileScreen';

// Register the service worker and request notification permissions
if ('serviceWorker' in navigator && 'PushManager' in window) {
  navigator.serviceWorker.register('/service-worker.js')
    .then(function(swReg) {
      console.log('Service Worker is registered', swReg);

      // Request notification permissions
      return askPermission();
    })
    .catch(function(error) {
      console.error('Service Worker Error', error);
    });
}

async function askPermission() {
  const permissionResult_1 = await new Promise(function (resolve, reject) {
    const permissionResult = Notification.requestPermission(function (result) {
      resolve(result);
    });

    if (permissionResult) {
      permissionResult.then(resolve, reject);
    }
  });
  if (permissionResult_1 !== 'granted') {
    throw new Error('Non sono stati concessi i permessi per le notifiche.');
  }
}

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setUser(user ? user : null);
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
            <Route path='/UserProfileScreen' element={<UserProfileScreen user={user} />} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));

export default App;
