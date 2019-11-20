const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var householdSchema = new Schema({
    lastname: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
        dropDups: true
    },
    password: {
        type: String,
        required: true
    },
    imageURL: {
        type: String,
        default: ''
    }
});

module.exports = mongoose.model('household', householdSchema);