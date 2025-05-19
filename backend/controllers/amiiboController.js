const axios = require('axios');

// Recupera tutti gli amiibo da API
const fetchAllAmiibos = async () => {
    try {
        const response = await axios.get('https://amiiboapi.com/api/amiibo/');
        return response.data.amiibo;
    } catch (error) {
        throw new Error('Error in fetching all amiibos');
    }
};

// Recupera i dati più recenti degli Amiibo rilasciati in Europa nel 2024
const fetchLatestAmiibo = async () => {
    try {
        const response = await axios.get('https://amiiboapi.com/api/amiibo/');
        const amiibos = response.data.amiibo;
        const latestAmiibos = amiibos.filter(amiibo => {
            const releaseYear = amiibo.release?.eu ? new Date(amiibo.release.eu).getFullYear() : null;
            return releaseYear === 2024;
        });
        return latestAmiibos;
    } catch (error) {
        throw new Error('Error in fetching latest amiibos');
    }
};

// Recupera gli Amiibo di una determinata serie
const fetchAmiiboBySeries = async (amiiboSeries) => {
    try {
        const response = await axios.get('https://amiiboapi.com/api/amiibo/');
        const amiibos = response.data.amiibo;
        return amiibos.filter(amiibo => amiibo.amiiboSeries.toLowerCase() === amiiboSeries.toLowerCase());
    } catch (error) {
        throw new Error('Error in fetching all amiibos filtered by series');
    }
};

// Recupera gli Amiibo di un determinato tipo
const fetchAmiiboByType = async (type) => {
    try {
        const response = await axios.get('https://amiiboapi.com/api/amiibo/');
        const amiibos = response.data.amiibo;
        return amiibos.filter(amiibo => amiibo.type.toLowerCase() === type.toLowerCase());
    } catch (error) {
        throw new Error('Error in fetching all amiibos filtered by type');
    }
};

// Recupera gli Amiibo di una determinata serie e determinato tipo
const fetchAmiiboBySeriesAndType = async (amiiboSeries, type) => {
    try {
        const response = await axios.get('https://amiiboapi.com/api/amiibo/');
        const amiibos = response.data.amiibo;
        const filteredAmiibos = amiibos.filter(amiibo =>
            amiibo.amiiboSeries.toLowerCase() === amiiboSeries.toLowerCase() &&
            amiibo.type.toLowerCase() === type.toLowerCase()
        );
        return filteredAmiibos;
    } catch (error) {
        throw new Error("Error in fetching all amiibos filtered by series and type");
    }
};

// Recupera un Amiibo dato il suo tail
const fetchAmiiboDetailsByTail = async (tail) => {
    try {
        const response = await axios.get('https://amiiboapi.com/api/amiibo/');
        const amiibos = response.data.amiibo;
        const foundAmiibo = amiibos.find(amiibo => amiibo.tail === tail);
        return foundAmiibo;
    } catch (error) {
        throw new Error("Error in fetching all amiibos filtered by series and type");
    }
};

module.exports = {
    fetchAllAmiibos,
    fetchLatestAmiibo,
    fetchAmiiboBySeries,
    fetchAmiiboBySeriesAndType,
    fetchAmiiboByType,
    fetchAmiiboDetailsByTail,
};