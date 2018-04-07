const mongoose = require('mongoose');

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
