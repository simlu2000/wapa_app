require('dotenv').config(); //inclusione delle variabili d'ambiente
const admin = require('firebase-admin');
const express = require('express');
const bodyParser = require('body-parser');

// Configurazione Firebase Admin utilizzando variabili d'ambiente
admin.initializeApp({
    credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
});

const app = express();
app.use(bodyParser.json()); //body-parser per interpretare le richieste JSON

// Funzione per inviare notifiche push
function sendPushNotification(token, message) {
    const payload = {
        notification: {
            title: 'Weather Alert',
            body: message,
        },
        token: token,
    };

    admin.messaging().send(payload)
        .then((response) => {
            console.log('Messaggio inviato con successo:', response);
        })
        .catch((error) => {
            console.error('Errore nell\'invio del messaggio:', error);
        });
}

// Endpoint per registrare il token FCM
app.post('/api/notifications/subscribe', (req, res) => {
    const { token, userId } = req.body;

    if (!token || !userId) {
        return res.status(400).json({ message: 'Token o ID utente mancante.' });
    }

    // Salvo il token nel Realtime Database di Firebase
    admin.database().ref(`users/${userId}/fcmToken`).set(token)
        .then(() => {
            res.status(200).json({ message: 'Token registrato con successo.' });
        })
        .catch((error) => {
            console.error('Errore nel salvataggio del token:', error);
            res.status(500).json({ message: 'Errore nel salvataggio del token.' });
        });
});

//utilizzo della funzione sendPushNotification
const exampleToken = 'user_device_token'; // Sostituisci con un token reale
const exampleMessage = 'Rain expected tomorrow, get your umbrella!';
sendPushNotification(exampleToken, exampleMessage);

// Avvio il server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Server in ascolto sulla porta ${PORT}`);
});
