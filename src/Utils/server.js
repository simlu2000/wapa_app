//server per invio notifiche push con Firebase Cloud Messaging

const admin = require('firebase-admin');
const serviceAccount = require('./path/to/serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const message = {
    notification: {
        title:'Weather Alert',
        body:'Rain expected tomorrow, get your umbrella!'
    },
    token:'user_device_token'
};

admin.messagging().send(message)
    .then((response) => {
        console.log('Message sent', response);
    })
    .catch((error) => {
        console.log('Error sending message:', error);
    })