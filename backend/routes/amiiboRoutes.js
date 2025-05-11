const express = require('express');
const router = express.Router();
const amiiboController = require("../controllers/amiiboController.js");

// Rotta per la home page
router.get('/', async (req, res) => {
    try {
        const latestAmiibo = await amiiboController.fetchLatestAmiibo();
        const superMarioBros = await amiiboController.fetchAmiiboBySeries('Super Mario Bros.');
        const legendOfZelda = await amiiboController.fetchAmiiboBySeries('Legend of Zelda');
        const animalCrossing = await amiiboController.fetchAmiiboBySeries('Animal Crossing');
        res.json({
            latestAmiibo,
            superMarioBros,
            legendOfZelda,
            animalCrossing
        });
    } catch (error) {
        console.error('Error in fetching amiibos', error);
        res.status(500).json({ error: 'Error in fetching amiibos' });
    }
});

// Rotta per recuperare la lista degli amiibo
router.get('/collection', async (req, res) => {
    const { amiiboSeries, type } = req.query;

    try {
        let amiibos = await amiiboController.fetchAllAmiibos();

        if (amiiboSeries && amiiboSeries !== "All") {
            amiibos = amiibos.filter(amiibo => amiibo.amiiboSeries.toLowerCase() === amiiboSeries.toLowerCase());
        }

        if (type && type !== "All") {
            amiibos = amiibos.filter(amiibo => amiibo.type.toLowerCase() === type.toLowerCase());
        }

        res.json(amiibos);
    } catch (error) {
        console.error('Error in fetching amiibos', error);
        res.status(500).send('Error in fetching amiibos');
    }
});


// Rotta per recuperare la lista degli amiibo o un amiibo in base ad un certo parametro
router.get('/collection/:param', async (req, res) => {
    const { param } = req.params;

    // 1. Se il parametro contiene "&", allora si sta filtrando per amiiboSeries e type
    if (param.includes("&")) {
        const [amiiboSeries, type] = param.split("&");
        if (["All", "Band", "Card", "Figure", "Yarn"].includes(type)) {
            try {
                const amiibos = await amiiboController.fetchAmiiboBySeriesAndType(amiiboSeries, type);
                res.json(amiibos);
            } catch (error) {
                console.error('Error in fetching amiibos:', error);
                res.status(500).send('Error in fetching amiibos');
            }
        } else {
            return res.status(400).json({ error: 'Unvalid type' });
        }
    }
    // 2. Se il parametro è uno dei type definiti, allora si sta filtrando per type
    else if (["All", "Band", "Card", "Figure", "Yarn"].includes(param)) {
        try {
            const amiibos = await amiiboController.fetchAmiiboByType(param);
            res.json(amiibos);
        } catch (error) {
            console.error('Error in fetching amiibos:', error);
            res.status(500).send('Error in fetching amiibos');
        }
    }
    // 3. Se il parametro è esadecimale, allora si sta recupernado l'ammibo con il corrispettivo tail
    else if (/^[0-9a-fA-F]+$/.test(param)) {
        try {
            const amiiboDetail = await amiiboController.getAmiiboDetailByTail(param);
            console.log(amiiboDetail);
            res.json(amiiboDetail);
        } catch (error) {
            console.error('Error in fetching amiibo by tail:', error);
            res.status(500).send('Error in fetching amiibo by tail');
        }
    }
    // 4. Altrimenti, si sta filtrando per amiiboSeries
    else {
        try {
            const amiibos = await amiiboController.fetchAmiiboBySeries(param);
            res.json(amiibos);
        } catch (error) {
            console.error('Error in fetching amiibos', error);
            res.status(500).send('Error in fetching amiibos');
        }
    }
});

module.exports = router;