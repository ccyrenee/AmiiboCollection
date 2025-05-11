const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    auth0Id: { type: String, required: true, unique: true },
    savedAmiibos: [{
        tail: { type: String, required: true },
        name: { type: String, required: true },
        image: { type: String, required: true }
    }]
});

module.exports = mongoose.model("User", userSchema);
