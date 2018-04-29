/**
 * @see module:helpers
 * @module helpers/sensorhub
 */

/* Models */
const SensorHub = require('./../models/sensorhub');
const Data = require('./../models/data');

/**
 * Tries to get given day's worth of data of a given Sensorhub.
 *
 * @function
 * @param {String} sensorHubName - SerialID of the Sensorhub you want data of.
 * @param {Number} amountOfDays - Number of days you want data of.
 * @returns {Promise} - Returns an array of data.
 */
function getSensorhubData(sensorHubName, amountOfDays) {
  return new Promise((resolve, reject) => {
    const today = new Date();
    const makeDate = new Date().setDate(today.getDate() - amountOfDays);
    const yesterday = new Date(makeDate);
    SensorHub.findOne({ SerialID: sensorHubName }).exec()
      .then(sensorHub => Data.find({
        SensorHub: sensorHubName,
        Timestamp: {
          $gte: yesterday,
          $lte: today,
        },
      }).exec()
        .then((data) => {
          const sensorHubData = [];
          for (let i = 0; i < data.length; i += 1) {
            const objData = data[i].toObject();
            objData.localDate = data[i].Timestamp.toLocaleString('nl-NL', {
              timeZone: 'Europe/Amsterdam',
            });

            sensorHubData.push(objData);
          }
          resolve([sensorHub, sensorHubData]);
        }).catch((err) => {
          reject(err);
        }));
  });
}

module.exports = {
  getSensorhubData,
};
