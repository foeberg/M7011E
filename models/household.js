const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var householdSchema = new Schema({
    lastname: String
});

module.exports = mongoose.model('household', householdSchema);