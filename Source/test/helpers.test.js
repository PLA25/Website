/* Converters */
const calculateDegrees = require('./helpers/converters.calculateDegrees.test');
const degreesToColor = require('./helpers/converters.degreesToColor.test');
const subtractDays = require('./helpers/converters.subtractDays.test');
const temperatureToColor = require('./helpers/converters.temperatureToColor.test');
const temperatureToDegrees = require('./helpers/converters.temperatureToDegrees.test');
const tileToLat = require('./helpers/converters.tileToLat.test');
const tileToLong = require('./helpers/converters.tileToLong.test');

/* Database */
const getAllData = require('./helpers/database.getAllData.test');

/* Image */
const downloadImage = require('./helpers/image.downloadImage.test');

describe('Helpers', () => {
  describe('Converters', () => {
    describe('Function: calculateDegrees', calculateDegrees);
    describe('Function: degreesToColor', degreesToColor);
    describe('Function: subtractDays', subtractDays);
    describe('Function: temperatureToColor', temperatureToColor);
    describe('Function: temperatureToDegrees', temperatureToDegrees);
    describe('Function: tileToLat', tileToLat);
    describe('Function: tileToLong', tileToLong);
  });

  describe('Database', () => {
    describe('Function: getAllData', getAllData);
  });

  describe('Image', () => {
    describe('Function: downloadImage', downloadImage);
  });
});
