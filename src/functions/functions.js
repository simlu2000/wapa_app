import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getMessaging } from "firebase/messaging";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect } from 'firebase/auth';
const admin = require('firebase-admin');
const axios = require('axios');

// Inizializza Firebase Admin SDK usando variabili d'ambiente
admin.initializeApp({
    credential: admin.credential.cert({
        "type": process.env.FIREBASE_TYPE,
        "project_id": process.env.FIREBASE_PROJECT_ID,
        "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
        "private_key": process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        "client_email": process.env.FIREBASE_CLIENT_EMAIL,
        "client_id": process.env.FIREBASE_CLIENT_ID,
        "auth_uri": process.env.FIREBASE_AUTH_URI,
        "token_uri": process.env.FIREBASE_TOKEN_URI,
        "auth_provider_x509_cert_url": process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
        "client_x509_cert_url": process.env.FIREBASE_CLIENT_X509_CERT_URL
    }),
    databaseURL: "https://wapa-4ec0a-default-rtdb.europe-west1.firebasedatabase.app/"
});

// Funzione per inviare notifiche push
async function sendPushNotification(token, message) {
    const payload = {
        notification: {
            title: 'Weather Alert',
            body: message,
        },
        token: token,
    };

    try {
        await admin.messaging().send(payload);
        console.log('Message sent successfully');
    } catch (error) {
        console.error('Error sending message:', error);
    }
}

// Inizializza Firebase App
const app = initializeApp({
    // Le tue configurazioni Firebase
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
});

// Inizializza il database e altre funzionalità
const database = getDatabase(app);
const messaging = getMessaging(app);
const auth = getAuth(app); // Aggiunta dell'autenticazione
const provider = new GoogleAuthProvider(); // Aggiunta del provider Google

// Esportazione della funzione compatibile con Netlify Functions
exports.handler = async (event) => {
    try {
        const weatherData = JSON.parse(event.body); // Ricevi i dati meteo dalla richiesta
        const conditions = weatherData.weather[0].main;
        const temp = weatherData.main.temp;

        // Recupera i token degli utenti dal database
        const usersSnapshot = await admin.database().ref('users').once('value');
        usersSnapshot.forEach(userSnapshot => {
            const token = userSnapshot.val().fcmToken;

            // Logica per inviare notifiche in base alle condizioni meteo
            if (conditions === 'Thunderstorm') {
                sendPushNotification(token, '⚡ Warning: a storm is expected!');
            } else if (conditions === 'Rain') {
                sendPushNotification(token, '🌧️ Warning: rain is expected!');
            } else if (temp <= 0) {
                sendPushNotification(token, '❄️ Warning: Extreme low temperature expected!');
            } else if (temp >= 35) {
                sendPushNotification(token, '🔥 Warning: Extreme high temperature expected!');
            }
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Notifications sent successfully' }),
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error sending notifications' }),
        };
    }
};

// Esporta auth e provider
module.exports = { auth, provider };
