/* Packages */
const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  valueID: {
    type: String,
    required: true,
    unique: true,
  },
  value: {
    type: String,
    required: true,
  },
});

/**
 * Class representing a SensorHub.
 * @class
 */
class Limitvalue {}

schema.loadClass(Limitvalue);
module.exports = mongoose.model('Limitvalue', schema);
