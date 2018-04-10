/** Requires the Mongoose module for database schemas. */
const mongoose = require('mongoose');

/**
 * Creates the SensorHub schema with attributes reflecting the ones in the database.
 * @todo Change "sensorHubScheme" to "sensorHubSchema".
 */
const sensorHubScheme = new mongoose.Schema({
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

module.exports = mongoose.model('SensorHub', sensorHubScheme);
