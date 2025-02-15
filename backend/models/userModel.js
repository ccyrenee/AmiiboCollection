const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    auth0Id: { type: String, required: true, unique: true },
    savedAmiibos: [{ type: String }]  // Array di 'tail' degli amiibo salvati
});

module.exports = mongoose.model('User', userSchema);
