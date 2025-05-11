const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const amiiboRoutes = require('./routes/amiiboRoutes.js');
const userRoutes = require('./routes/userRoutes.js');

dotenv.config();

const app = express();
const port = 3000;

// Verifica che la variabile di ambiente sia letta correttamente
console.log('Auth0 Domain:', process.env.AUTH0_DOMAIN);
if (!process.env.AUTH0_DOMAIN) {
    throw new Error('AUTH0_DOMAIN is not defined!');
}

// Middleware
app.use(cors({
    origin: 'http://localhost:5173',  // Permetti solo il dominio specificato
    methods: ['GET', 'POST', 'DELETE'], // Le metodologie consentite
    credentials: true  // Consenti l'invio di credenziali (come i cookies)
}));

app.options('*', cors());
app.use(bodyParser.json()); // Per parse i dati JSON nelle richieste

// Connessione a MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error: ', err));

// Usa le rotte importate
app.use('/', amiiboRoutes);
app.use('/profile', userRoutes);

// Avvio del server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
