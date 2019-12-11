const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var userSchema = new Schema({
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
    role: {
        type: String,
        default: 'prosumer'
    },
    imageURL: {
        type: String,
        default: ''
    }
});

module.exports = mongoose.model('user', userSchema);