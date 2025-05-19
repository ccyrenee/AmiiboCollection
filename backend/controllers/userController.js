const axios = require("axios");
const User = require('../models/userModel');

// Recupera gli amiibo salvati (tail) per l'utente autenticato
const getSavedAmiibos = async (req, res) => {
    const { auth0Id } = req.user;
    try {
        let user = await User.findOne({ auth0Id });
        if (!user) {
            user = new User({ auth0Id, savedAmiibos: [] });
            await user.save();
        }
        console.log("Tails", user.savedAmiibos);
        return res.status(200).json({ savedAmiibos: user.savedAmiibos });
    } catch (error) {
        console.error("Error fetching saved tails:", error);
        return res.status(500).json({ error: 'Error fetching saved tails' });
    }
};


// Salva un amiibo (tail) nella lista salvata
const saveAmiibo = async (req, res) => {
    const { auth0Id } = req.user;
    let { tail } = req.body;
    if (!tail) {
        return res.status(400).json({ error: 'Missing amiibo tail' });
    }
    tail = String(tail);
    try {
        let user = await User.findOne({ auth0Id });
        if (!user) {
            user = new User({ auth0Id, savedAmiibos: [tail] });
            await user.save();
            return res.status(201).json({ savedAmiibos: user.savedAmiibos });
        }
        if (!user.savedAmiibos.includes(tail)) {
            user.savedAmiibos.push(tail);
            await user.save();
        }
        console.log("Tail saved: ", user.savedAmiibos);
        res.status(200).json({ savedAmiibos: user.savedAmiibos });
    } catch (error) {
        console.error("Error saving amiibo's tail:", error);
        res.status(500).json({ error: 'Error saving amiibo' });
    }
};

// Rimuove un amiibo (tail) dalla lista salvata
const removeAmiibo = async (req, res) => {
    const { auth0Id } = req.user;
    const { tail } = req.params;
    try {
        const user = await User.findOne({ auth0Id });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.savedAmiibos = user.savedAmiibos.filter(t => t !== String(tail));
        await user.save();
        console.log("Tail removed: ", user.savedAmiibos);
        res.status(200).json({ message: "Amiibo removed successfully" });
    } catch (error) {
        console.log("Error removing amiibo's tail:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = {
    getSavedAmiibos,
    saveAmiibo,
    removeAmiibo,
};