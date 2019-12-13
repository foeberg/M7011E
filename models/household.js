const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const config = require('../config.json');

var householdSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        dropDups: true
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
        default: 0.0,
        min: 0.0,
        max: config.household_buffer_cap
    }
});

module.exports = mongoose.model('household', householdSchema);