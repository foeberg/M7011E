const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const config = require('../config.json');

var powerplantSchema = new Schema({
    status: {
        type: String,
        default: 'Stopped',
    },
    production: {
        type: Number,
        min: 0.0,
        max: 1.0,
        default: 0.0
    },
    bufferRatio: {
        type: Number,
        default: 0.3,
        min: 0.0,
        max: 1.0
    },
    buffer: {
        type: Number,
        default: 0.0,
        min: 0.0,
        max: config.powerplant_buffer_cap
    },
    electricityPrice: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('powerplant', powerplantSchema);