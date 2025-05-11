const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware.js");
const { authenticateUser, getSavedAmiibos, saveAmiibo, removeAmiibo } = require("../controllers/userController.js");

router.get('/profile/collection', authMiddleware, authenticateUser, getSavedAmiibos);
router.post('/profile/collection/:tail', authMiddleware, authenticateUser, saveAmiibo);
router.delete('/profile/collection/:tail', authMiddleware, authenticateUser, removeAmiibo);

module.exports = router;