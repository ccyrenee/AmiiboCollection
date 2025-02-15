const mongoose = require('mongoose');

const amiiboSchema = new mongoose.Schema({
    amiiboSeries: {
        type: String,
        required: true
    },
    character: {
        type: String,
        required: true
    },
    gameSeries: {
        type: String,
        required: true
    },
    head: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    release: {
        au: {
            type: Date,
            required: true
        },
        eu: {
            type: Date,
            required: true
        },
        jp: {
            type: Date,
            required: true
        },
        na: {
            type: Date,
            required: true
        }
    },
    tail: {
        type: String,
        required: true,
        unique: true
    },
    type: {
        type: String,
        required: true
    }
});

const Amiibo = mongoose.model('Amiibo', amiiboSchema);

module.exports = Amiibo;
