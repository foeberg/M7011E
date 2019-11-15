const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var dateSchema = new Schema({
    date: Schema.Types.Date
});

module.exports = mongoose.model('date', dateSchema, 'date');