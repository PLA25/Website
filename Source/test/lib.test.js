const tempToColor = require('./lib/converter.tempToColor.test');
const tempToDegrees = require('./lib/converter.tempToDegrees.test');
const tileToLat = require('./lib/converter.tileToLat.test');
const tileToLong = require('./lib/converter.tileToLong.test');

describe('Lib', () => {
  describe('tempToColor', tempToColor);

  describe('tempToDegrees', tempToDegrees);

  describe('tileToLat', tileToLat);

  describe('tileToLong', tileToLong);
});
