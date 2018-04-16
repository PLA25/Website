/* Converter */
const tempToColor = require('./lib/converter.tempToColor.test');
const tempToDegrees = require('./lib/converter.tempToDegrees.test');
const tileToLat = require('./lib/converter.tileToLat.test');
const tileToLong = require('./lib/converter.tileToLong.test');

/* Generator */
const generateImage = require('./lib/generator.generateImage.test');
const getIncrement = require('./lib/generator.getIncrement.test');

/* Helpers */
const downloadImage = require('./lib/helpers.downloadImage.test');

describe('Lib', () => {
  describe('Converter', () => {
    describe('tempToColor', tempToColor);

    describe('tempToDegrees', tempToDegrees);

    describe('tileToLat', tileToLat);

    describe('tileToLong', tileToLong);
  });

  describe('Generator', () => {
    describe('generateImage', generateImage);

    describe('getIncrement', getIncrement);
  });

  describe('Helpers', () => {
    describe('downloadImage', downloadImage);
  });
});
