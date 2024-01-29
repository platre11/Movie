// server.js
const express = require('express');
const app = express();
const db = require('./firebase/firebaseConfig'); // Assurez-vous que le chemin est correct

app.use(express.json()); // Middleware pour parser le JSON

const movieRoutes = require('./routes/movieRoutes'); // Importez les routes
app.use('/movies', movieRoutes); // Utilisez les routes

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
