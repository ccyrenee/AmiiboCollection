const User = require('../models/userModel');

// Recupera gli amiibo salvati per l'utente autenticato
const getSavedAmiibos = async (req, res) => {
    const { auth0Id } = req.user;
    try {
        const user = await User.findOne({ auth0Id });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user.savedAmiibos);
    } catch (error) {
        res.status(500).json({ error: 'Error in fetching saved amiibos' });
    }
};

// Salva un amiibo per l'utente autenticato
const saveAmiibo = async (req, res) => {
    const { auth0Id } = req.user;
    const { tail } = req.body;

    try {
        let user = await User.findOne({ auth0Id });

        if (!user) {
            user = new User({ auth0Id, savedAmiibos: [tail] });
        } else if (!user.savedAmiibos.includes(tail)) {
            user.savedAmiibos.push(tail);
        }

        await user.save();
        res.status(200).json({ message: 'Amiibo saved successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error in saving amiibo' });
    }
};

// Rimuove un amiibo dalla collezione dell'utente autenticato
const removeAmiibo = async (req, res) => {
    const { auth0Id } = req.user;
    const { tail } = req.body;

    try {
        const user = await User.findOne({ auth0Id });
        if (!user || !user.savedAmiibos.includes(tail)) {
            return res.status(404).json({ message: 'Amiibo not found' });
        }

        user.savedAmiibos = user.savedAmiibos.filter((amiiboTail) => amiiboTail !== tail);
        await user.save();

        res.status(200).json({ message: 'Amiibo removed successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error in removing amiibo' });
    }
};

module.exports = {
    getSavedAmiibos,
    saveAmiibo,
    removeAmiibo
};