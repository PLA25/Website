/** Requires the Mongoose module for database schemas. */
const mongoose = require('mongoose');

/**
 * Creates the Data schema with attributes reflecting the ones in the database.
 * @todo Change "dataScheme" to "dataSchema".
 */
const dataScheme = new mongoose.Schema({
  SensorHub: {
    type: String,
    required: true,
  },
  Type: {
    type: String,
    required: true,
  },
  Timestamp: {
    type: Date,
    required: true,
  },
  Value: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Data', dataScheme);
