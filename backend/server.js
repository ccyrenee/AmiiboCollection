const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const axios = require('axios');
const express = require('express');
const router = express.Router();

const authMiddleware = require('./middlewares/authMiddleware.jsx');
const amiiboController = require('./controllers/amiiboController.jsx');
const userController = require('./controllers/userController.jsx');

const amiiboRoutes = require('./routes/amiiboRoutes.jsx');
const userRoutes = require('./routes/userRoutes.jsx');

dotenv.config();

const app = express();
const port = 3000;

// Middleware
app.use(cors());
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
