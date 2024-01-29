// MovieRoute.js
const express = require('express');
const router = express.Router();
const db = require('../firebase/firebaseConfig'); // Le chemin doit correspondre à l'emplacement réel du fichier firebaseConfig.js

router.use(express.json());

router.get('/', async (req, res) => {
    try {
        const snapshot = await db.collection('movies').get();
        const movies = snapshot.docs.map(doc => {
            const data = doc.data();
            return { id: doc.id, title: data.title }; // 'title' est le nom du champ uniforme
        });
        res.status(200).json(movies);
    } catch (error) {
        console.error('Error getting movies:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
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

    // Vérifiez d'abord que le titre et la description ne sont pas undefined
    if (title === undefined || description === undefined) {
        return res.status(400).send('Title and description are required.');
    }

    try {
        // Si le titre et la description sont définis, alors ajoutez le film à la collection
        const movie = await db.collection('movies').add({ title, description, imageUrl });
        res.status(201).send(`Created a new movie: ${movie.id}`);
    } catch (error) {
        console.error('Error adding movie:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.delete('/:id', async (req, res) => {
    await db.collection('movies').doc(req.params.id).delete();
    res.status(200).send(`Deleted movie with id: ${req.params.id}`);
});

module.exports = router;
