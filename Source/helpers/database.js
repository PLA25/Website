/**
 * @see module:helpers
 * @module helpers/database
 */

/* Helpers */
const {
  subtractDays,
} = require('./converters');

/* Models */
const Data = require('./../models/data');
const SensorHub = require('./../models/sensorhub');

/**
 * Retrieves all data for a specified SensorHub between today and the given number of days back.
 *
 * @function
 * @param {String} serialID - SerialID of the SensorHub to look up.
 * @param {Number} numberOfDays - How far back to look up data.
 * @returns {Promise} Promise object represents the SensorHub and an array containing all data.
 */
function getAllData(serialID, numberOfDays) {
  return new Promise((resolve, reject) => {
    if (typeof serialID !== 'string') {
      reject(new Error('Expected \'serialID\' to be a string!'));
      return;
    }

    if (typeof numberOfDays !== 'number') {
      reject(new Error('Expected \'numberOfDays\' to be a number!'));
      return;
    }

    SensorHub.findOne({
      SerialID: serialID,
    }).exec()
      .then((sensorHub) => {
        if (sensorHub === null) {
          reject(new Error(`Could not find SensorHub with ID: '${serialID}'!`));
          return;
        }

        const today = new Date();
        const yesterday = subtractDays(today, numberOfDays);

        Data.find({
          SensorHub: sensorHub.SerialID,
          Timestamp: {
            $gte: yesterday,
            $lte: today,
          },
        }).exec()
          .then((data) => {
            const sensorHubData = [];
            for (let i = 0; i < data.length; i += 1) {
              const dataObject = data[i].toObject();
              dataObject.localDate = data[i].Timestamp.toLocaleString('nl-NL', {
                timeZone: 'Europe/Amsterdam',
              });

              sensorHubData.push(dataObject);
            }

            resolve([sensorHub, sensorHubData]);
          })
          .catch((err) => {
            reject(err);
          });
      })
      .catch((err) => {
        reject(err);
      });
  });
}

module.exports = {
  getAllData,
};
