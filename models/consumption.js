const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var consumptionSchema = new Schema({
    householdId: Schema.Types.ObjectId,
    consumption: Schema.Types.Decimal128,
    timestamp: Number
});

module.exports = mongoose.model('consumption', consumptionSchema);