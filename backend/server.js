const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const amiiboRoutes = require('./routes/amiiboRoutes.js');
const userRoutes = require('./routes/userRoutes.js');

const app = express();
const port = 3000;

// Middleware
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'DELETE'],
    credentials: true  // Per consentire l'invio di credenziali (come i cookies)
}));

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