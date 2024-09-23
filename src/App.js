import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { auth } from './Utils/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import SideBar from "./Components/Sidebar";
import Footer from "./Components/Footer";
import HomeScreen from "./Screens/HomeScreen";
import WeatherScreen from './Screens/WeatherScreen';
import AdvancedScreen from './Screens/AdvancedScreen';
import SignUpScreen from './Screens/SignUpScreen';
import PrivacyPolicesScreen from './Screens/PrivacyPolicesScreen';
import UserProfileScreen from './Screens/UserProfileScreen';
import AboutScreen from './Screens/AboutScreen';

const App = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            setUser(user ? user : null);
        });

        // Registrazione del Service Worker e richiesta dei permessi per le notifiche
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            navigator.serviceWorker.register('/firebase-messaging-sw.js')
                .then(function(swReg) {
                    console.log('Service Worker registrato:', swReg);
                })
                .catch(function(error) {
                    console.error('Errore nella registrazione del Service Worker:', error);
                });
        }

       

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