/* Helpers */
const calculateDegrees = require('./helpers/converters.calculateDegrees.test');
const degreesToColor = require('./helpers/converters.degreesToColor.test');
const temperatureToColor = require('./helpers/converters.temperatureToColor.test');
const temperatureToDegrees = require('./helpers/converters.temperatureToDegrees.test');
const tileToLat = require('./helpers/converters.tileToLat.test');
const tileToLong = require('./helpers/converters.tileToLong.test');

describe('Helpers', () => {
  describe('Converters', () => {
    describe('Function: calculateDegrees', calculateDegrees);
    describe('Function: degreesToColor', degreesToColor);
    describe('Function: temperatureToColor', temperatureToColor);
    describe('Function: temperatureToDegrees', temperatureToDegrees);
    describe('Function: tileToLat', tileToLat);
    describe('Function: tileToLong', tileToLong);
  });
});
