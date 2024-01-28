const express = require('express');
const router = express.Router();
const db = require('../firebase/firebaseConfig'); // Le chemin doit correspondre à l'emplacement réel du fichier firebaseConfig.js

router.use(express.json());

router.get('/', async (req, res) => {
    const snapshot = await db.collection('movies').get();
    // Cette ligne suivante sera modifiée pour ne récupérer que les titres des films
    const movieTitles = snapshot.docs.map(doc => doc.data().movie); // Supposer que 'movie' est la clé pour les titres des films dans vos documents
    res.status(200).json(movieTitles);
  });
  

router.get('/:id', async (req, res) => {
    const snapshot = await db.collection('movies').doc(req.params.id).get();
    if (!snapshot.exists) {
        return res.status(404).send('Movie not found');
    }
    res.status(200).json({ id: snapshot.id, ...snapshot.data() });
});

router.post('/', async (req, res) => {
    const { title, description, imageUrl } = req.body;
    const movie = await db.collection('movies').add({ title, description, imageUrl });
    res.status(201).send(`Created a new movie: ${movie.id}`);
});

router.delete('/:id', async (req, res) => {
    await db.collection('movies').doc(req.params.id).delete();
    res.status(200).send(`Deleted movie with id: ${req.params.id}`);
});

module.exports = router;
