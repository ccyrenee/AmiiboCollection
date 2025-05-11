const express = require("express");
const router = express.Router();
const { getSavedAmiibos, saveAmiibo, removeAmiibo } = require("../controllers/userController");
const { authMiddleware } = require('../middlewares/authMiddleware');

// Middleware di autenticazione
router.use(authMiddleware); // applica una sola volta

// routes/userRoutes.js
router.get("/profile/collection", getSavedAmiibos);
router.post("/profile/collection", saveAmiibo);
router.delete("/profile/collection", removeAmiibo);

module.exports = router;
