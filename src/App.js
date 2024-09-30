import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { auth } from './Utils/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import SideBar from "./Components/Sidebar";
import HomeScreen from "./Screens/HomeScreen";
import WeatherScreen from './Screens/WeatherScreen';
import AdvancedScreen from './Screens/AdvancedScreen';
import SignUpScreen from './Screens/SignUpScreen';
import PrivacyPolicesScreen from './Screens/PrivacyPolicesScreen';
import UserProfileScreen from './Screens/UserProfileScreen';
import AboutScreen from './Screens/AboutScreen';

const App = () => {
  const [user, setUser] = useState(null);

  // Imposta un listener per le modifiche allo stato di autenticazione
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });

    // Cleanup il listener quando il componente viene smontato
    return () => unsubscribe();
  }, []);

  return (
    <div className='App'>
      <SideBar user={user} />
      <div className='main-content'>
        <Routes>
          <Route path='/' element={<HomeScreen />} />
          <Route path='/WeatherScreen' element={<WeatherScreen />} />
          <Route path='/AdvancedScreen' element={<AdvancedScreen />} />
          <Route path='/SignUpScreen' element={<SignUpScreen />} />
          <Route path='/PrivacyPolicesScreen' element={<PrivacyPolicesScreen />} />
          <Route path='/UserProfileScreen' element={<UserProfileScreen user={user} />} />
          <Route path='/AboutScreen' element={<AboutScreen />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
