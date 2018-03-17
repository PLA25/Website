var config = require('./../config');
var mongoose = require('mongoose');

var db = mongoose.connect(`mongodb://${config.MongoDB.User}:${config.MongoDB.Pass}@${config.MongoDB.Host}:${config.MongoDB.Port}/${config.MongoDB.Name}`);
var schema = mongoose.Schema;

var sensorHubScheme = new schema({
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
