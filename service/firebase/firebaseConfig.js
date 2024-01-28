
const admin = require('firebase-admin');
const serviceAccount = require('../../service/platre11-firebase-adminsdk-aaml0-c7f9bb93d6.json'); // Assurez-vous que le chemin est correct

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
module.exports = db;
