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
    },
    sellRatio: {
        type: Number,
        default: 0.3,
        min: 0.0,
        max: 1.0
    },
    buyRatio: {
        type: Number,
        default: 0.3,
        min: 0.0,
        max: 1.0
    },
    buffer: {
        type: Number,
        default: 0.0
    }
});

module.exports = mongoose.model('household', householdSchema);