const express = require('express');
const router = express.Router();
const { getSavedAmiibos, saveAmiibo, removeAmiibo } = require('../controllers/userController.jsx');
const authMiddleware = require('../middlewares/authMiddleware.jsx');

// Recupera dei dettagli dell'utente e la sua collezione di amiibo
router.get('/profile', authMiddleware, getSavedAmiibos);

// Salva o rimuove un amiibo dalla collezione dell'utente
router.post('/profile', authMiddleware, saveAmiibo);
router.delete('/profile', authMiddleware, removeAmiibo);

module.exports = router;