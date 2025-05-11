const User = require('../models/userModel');

// Middleware di autenticazione
const authenticateUser = async (req, res, next) => {
    console.log('Authorization header:', req.headers.authorization);  // Debug
    const { auth0Id } = req.user;  // auth0Id dovrebbe essere già estratto dal token JWT

    try {
        let user = await User.findOne({ auth0Id });
        if (!user) {
            user = new User({
                auth0Id: auth0Id,
                savedAmiibos: []
            });

            await user.save();
            console.log(`New user created: ${auth0Id}`);
        }

        req.user = user;  // Attacca l'utente alla richiesta
        console.log("User attached to request:", req.user); // Debug per vedere l'utente
        next();  // Passa al prossimo middleware
    } catch (error) {
        console.error("Error authenticating user:", error);
        res.status(500).json({ message: "Error authenticating user." });
    }
};

// Recupera gli amiibo salvati dell'utente autenticato
// controllers/userController.js
const getSavedAmiibos = async (req, res) => {
    try {
        console.log("Fetching saved Amiibos for user:", req.user.auth0Id); // Log dell'utente
        const user = await User.findOne({ auth0Id: req.user.auth0Id });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user.savedAmiibos);
    } catch (error) {
        console.error("❌ Errore durante il recupero degli Amiibo salvati:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


// Salva un amiibo per l'utente autenticato
const saveAmiibo = async (req, res) => {
    try {
        const { tail, name, image } = req.body;
        const user = await User.findOne({ auth0Id: req.user.auth0Id });  // Usa req.user per accedere al auth0Id

        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        const amiiboExists = user.savedAmiibos.some(a => a.tail === tail);
        if (amiiboExists) {
            return res.status(400).send({ message: 'Amiibo already saved' });
        }

        user.savedAmiibos.push({ tail, name, image });
        await user.save();
        res.status(200).send({ message: 'Amiibo saved successfully' });
    } catch (error) {
        console.error("Error saving amiibo:", error);  // Log per errore
        res.status(500).send({ message: "Error saving amiibo" });
    }
};

// Rimuove un amiibo dalla collezione dell'utente autenticato
const removeAmiibo = async (req, res) => {
    try {
        const { tail } = req.params;
        const user = await User.findOne({ auth0Id: req.user.auth0Id });  // Usa req.user per accedere al auth0Id

        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        const amiiboIndex = user.savedAmiibos.findIndex(a => a.tail === tail);
        if (amiiboIndex === -1) {
            return res.status(400).send({ message: 'Amiibo not found in collection' });
        }

        user.savedAmiibos.splice(amiiboIndex, 1);
        await user.save();
        res.status(200).send({ message: 'Amiibo removed successfully' });
    } catch (error) {
        console.error("Error removing amiibo:", error);  // Log per errore
        res.status(500).send({ message: "Error removing amiibo" });
    }
};

module.exports = {
    authenticateUser,
    getSavedAmiibos,
    saveAmiibo,
    removeAmiibo
};
