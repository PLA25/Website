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
class Setting {}

schema.loadClass(Setting);
module.exports = mongoose.model('Setting', schema);
