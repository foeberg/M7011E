const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var consumptionSchema = new Schema({
    householdId: Schema.Types.ObjectId,
    consumption: Schema.Types.Decimal128,
    timestamp: Schema.Types.Date
});

module.exports = mongoose.model('consumption', consumptionSchema);