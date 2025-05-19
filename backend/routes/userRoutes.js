const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware.js");
const { getSavedAmiibos, saveAmiibo, removeAmiibo } = require("../controllers/userController.js");

//Recupero della lista di tail salvati dall'utente autenticato
router.get('/collection', authMiddleware, getSavedAmiibos);

//Salva il tail di un amiibo nella lista dei salvati dell'utente autenticato
router.post('/collection', authMiddleware, saveAmiibo);

//Rimuove il tail di un amiibo nella lista dei salvati dell'utente autenticato
router.delete('/collection/:tail', authMiddleware, removeAmiibo);

module.exports = router;