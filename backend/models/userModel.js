const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    auth0Id: {type: String, required: true, unique: true,},
    savedAmiibos: [{ type: String }] //Array di tail
});

module.exports = mongoose.model("User", userSchema);
