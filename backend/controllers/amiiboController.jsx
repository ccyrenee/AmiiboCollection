const axios = require('axios');

// Recupera tutti gli amiibo
const fetchAllAmiibos = async () => {
    try {
        const response = await axios.get('https://amiiboapi.com/api/amiibo/');
        return response.data.amiibo;
    } catch (error) {
        console.error('Error in fetch all amiibos:', error);
        throw error;
    }
};

// Recupera i dati più recenti degli Amiibo rilasciati nel 2024
const fetchLatestAmiibo = async () => {
    try {
        const response = await axios.get('https://amiiboapi.com/api/amiibo/');
        const amiibos = response.data.amiibo;
        // Filtra per gli amiibo rilasciati nel 2024 considerando solo release.eu
        const latestAmiibos = amiibos.filter(amiibo => {
            const releaseYear = amiibo.release?.eu ? new Date(amiibo.release.eu).getFullYear() : null;
            return releaseYear === 2024;
        });
        return latestAmiibos;
    } catch (error) {
        throw error;
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

// Recupera gli Amiibo di una determinata serie e tipo
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
        console.error("Error in fetching all amiibos filtered by series and type:", error);
        throw new Error("Error in fetching all amiibos filtered by series and type");
    }
};

// Recupera i dettagli di un amiibo con il suoi tail
const getAmiiboDetailByTail = async (tail) => {
    try {
        const response = await axios.get('https://amiiboapi.com/api/amiibo/');
        if (response.data && response.data.amiibo) {
            const amiibo = response.data.amiibo.find((item) => item.tail === tail);
            if (amiibo) {
                return amiibo;
            } else {
                throw new Error("Amiibo not found");
            }
        } else {
            throw new Error("No data available from API");
        }
    } catch (error) {
        console.error("Error in fetching amiibo:", error);
        throw new Error("Error in fetching amiibo");
    }
};

module.exports = {
    fetchAllAmiibos,
    fetchLatestAmiibo,
    fetchAmiiboBySeries,
    fetchAmiiboBySeriesAndType,
    fetchAmiiboByType,
    getAmiiboDetailByTail
};