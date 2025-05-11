const User = require('../models/userModel');

// Middleware di autenticazione
const authenticateUser = async (req, res, next) => {
    console.log('Authorization header:', req.headers.authorization);  // Aggiungi questo log
    const { auth0Id } = req.user;  // auth0Id dovrebbe essere già estratto dal token JWT

    try {
        // Verifica se l'utente esiste già nel database
        let user = await User.findOne({ auth0Id });

        if (!user) {
            user = new User({
                auth0Id: auth0Id,
                savedAmiibos: []  // Inizializza savedAmiibos come array vuoto
            });

            await user.save();
            console.log(`New user created: ${auth0Id}`);
        }

        req.user = user;  // Attacca l'utente alla richiesta
        next();  // Passa al prossimo middleware
    } catch (error) {
        console.error("Error authenticating user:", error);
        res.status(500).json({ message: "Error authenticating user." });
    }
};

// Retrieve saved amiibos for the authenticated user
const getSavedAmiibos = async (req, res) => {
    const { auth0Id } = req.user;  // auth0Id è disponibile dopo il middleware di autenticazione
    try {
        const user = await User.findOne({ auth0Id });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        console.log("User found:", user); // Log per vedere i dati dell'utente
        res.status(200).json({ savedAmiibos: user.savedAmiibos || [] });
    } catch (error) {
        console.error("Error retrieving saved amiibos:", error);
        res.status(500).json({ error: 'Error in fetching saved amiibos' });
    }
};

// Save an amiibo for the authenticated user
const saveAmiibo = async (req, res) => {
    try {
        console.log("Received request to save Amiibo", req.body); // Aggiungi log per debug
        const userId = req.user.sub;
        const tail = req.params.tail;

        // La logica di salvataggio dell'amiibo
        const savedAmiibo = await User.updateOne(
            { _id: userId },
            { $addToSet: { savedAmiibos: { tail } } }  // Esegui l'aggiornamento del documento
        );

        res.status(200).json(savedAmiibo);
    } catch (error) {
        console.error("Error while saving amiibo:", error);  // Log dell'errore
        res.status(500).json({ error: "An error occurred while saving the Amiibo" });
    }
};

// Remove an amiibo from the user's collection
const removeAmiibo = async (req, res) => {
    const { auth0Id } = req.user;  // auth0Id è disponibile dopo il middleware di autenticazione
    const { tail } = req.params;

    try {
        const user = await User.findOne({ auth0Id });

        if (!user || !user.savedAmiibos.some(a => a.tail === tail)) {
            return res.status(404).json({ message: 'Amiibo not found' });
        }

        // Remove the amiibo from the collection
        user.savedAmiibos = user.savedAmiibos.filter(a => a.tail !== tail);
        await user.save();

        res.status(200).json(user.savedAmiibos);  // Return the updated list of saved amiibos
    } catch (error) {
        console.error("Error removing amiibo:", error);
        res.status(500).json({ error: 'Error in removing amiibo' });
    }
};

module.exports = {
    authenticateUser,
    getSavedAmiibos,
    saveAmiibo,
    removeAmiibo
};