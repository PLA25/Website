/* Packages */
const mongoose = require('mongoose');

const schema = new mongoose.Schema({
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
  inMargin: {
    type: Number,
    required: true,
  },
});

/**
 * Class representing a data.
 * @class
 */
class Data {}

schema.loadClass(Data);
module.exports = mongoose.model('Data', schema);
