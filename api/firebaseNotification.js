require('dotenv').config();
const admin = require('firebase-admin');
//const serviceAccount = require('./serviceAccountKey.json'); 


const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://notification-cda9b.firebaseio.com' 
});

module.exports = admin;