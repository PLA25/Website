const mongoose = require('mongoose');

const sensorHubScheme = new mongoose.Schema({
  SerialID: {
    type: String,
    required: true
  },
  Latitude: {
    type: String,
    required: true
  },
  Longitude: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('SensorHub', sensorHubScheme);
