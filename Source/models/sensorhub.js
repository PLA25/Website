/* Packages */
const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  SerialID: {
    type: String,
    required: true,
  },
  Latitude: {
    type: String,
    required: true,
  },
  Longitude: {
    type: String,
    required: true,
  },
});

/**
 * Class representing a SensorHub.
 * @class
 */
class SensorHub {}

schema.loadClass(SensorHub);
module.exports = mongoose.model('SensorHub', schema);
