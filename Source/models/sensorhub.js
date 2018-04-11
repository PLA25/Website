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
class SensorHub {
  /**
   * Creates a new sensorhub.
   * @param {string} serialID - The serialID value.
   * @param {string} latitude - The latitude value.
   * @param {string} longitude - The longitude value.
   */
  constructor(serialID, latitude, longitude) {
    this.SerialID = serialID;
    this.Latitude = latitude;
    this.Longitude = longitude;
  }
}

schema.loadClass(SensorHub);
module.exports = mongoose.model('SensorHub', schema);
