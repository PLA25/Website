/**
 * @module lib
 */

const {
  tempToColor,
  tempToDegrees,
  tileToLat,
  tileToLong,
} = require('./converter');

const {
  generateImage,
} = require('./generator');

module.exports = {
  generateImage,
  tempToColor,
  tempToDegrees,
  tileToLat,
  tileToLong,
};
