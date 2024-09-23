const admin = require('firebase-admin');
const express = require('express');
const bodyParser = require('body-parser');
const serviceAccount = require('./path/to/serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://wapa-4ec0a-default-rtdb.europe-west1.firebasedatabase.app/"
});

const app = express();
app.use(bodyParser.json());

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
            console.log('Message sent successfully:', response);
        })
        .catch((error) => {
            console.error('Error sending message:', error);
        });
}

// Endpoint per registrare il token
app.post('/api/notifications/subscribe', (req, res) => {
    const { token, userId } = req.body; // Ottieni anche l'ID utente dal corpo della richiesta

    if (!userId) {
        return res.status(400).send('User ID mancante.');
    }

    // Salva il token nel Realtime Database
    admin.database().ref(`users/${userId}/fcmToken`).set(token)
        .then(() => {
            res.status(200).send('Token registrato con successo.');
        })
        .catch((error) => {
            console.error('Error saving token:', error);
            res.status(500).send('Errore nel salvataggio del token.');
        });
});

// Esempio di utilizzo della funzione
const userDeviceToken = 'user_device_token'; // Sostituisci con il token del dispositivo dell'utente
const alertMessage = 'Rain expected tomorrow, get your umbrella!';

// Invia un messaggio di esempio (puoi rimuovere questa parte se non necessaria)
sendPushNotification(userDeviceToken, alertMessage);

// Avvia il server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Server in ascolto sulla porta ${PORT}`);
});
