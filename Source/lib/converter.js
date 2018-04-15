/**
 * @see module:lib
 * @module lib/converter
 */

/**
 * Converts temperature, in celsius, to degrees.
 *
 * @function
 * @param {number} temp - temperature in celsius
 * @return {number} 0 - 360
 */
function tempToDegrees(temp) {
  /*
   * Creates the degrees, from a temperature range of -70 to 50.
   */
  let degrees = 360 - (((temp + 50) / 100) * 360);

  while (degrees > 360) {
    degrees -= 360;
  }

  while (degrees < 0) {
    degrees += 360;
  }

  /*
   * Returns the degrees.
   */
  return degrees;
}

/**
 * Converts temperature, in celsius, to RGB.
 *
 * @function
 * @param {number} temp - temperature in celsius
 * @returns {number[]} Red, Green, Blue (RGB)
 */
function tempToColor(temp) {
  /*
   * Finds the degrees for further conversion.
   */
  const degrees = tempToDegrees(temp);
  let value = 0;

  // [255, 0, 0] -> [255, 255, 0]
  if (degrees <= 60) {
    value = Math.round((degrees / 60) * 255);
    return [255, value, 0];
  }

  // [255, 255, 0] -> [0, 255, 0]
  if (degrees <= 120) {
    value = 255 - Math.round(((degrees - 60) / 60) * 255);
    return [value, 255, 0];
  }

  // [0, 255, 0] -> [0, 255, 255]
  if (degrees <= 180) {
    value = Math.round(((degrees - 120) / 60) * 255);
    return [0, 255, value];
  }

  // [0, 255, 255] -> [0, 0, 255]
  if (degrees <= 240) {
    value = 255 - Math.round(((degrees - 180) / 60) * 255);
    return [0, value, 255];
  }

  // [0, 0, 255] -> [255, 0, 255]
  if (degrees <= 300) {
    value = Math.round(((degrees - 240) / 60) * 255);
    return [value, 0, 255];
  }

  // [255, 0, 255] -> [255, 0, 0]
  value = 255 - Math.round(((degrees - 300) / 60) * 255);
  return [255, 0, value];
}

/**
 * Converts a tile with x- and z-coordinates to a longitude.
 *
 * @param {number} x - The x-coordinate.
 * @param {number} z - The z-coordinate.
 * @returns {number} - The longitude.
 */
function tileToLong(x, z) {
  return (((x / (2 ** z)) * 360) - 180);
}

/**
 * Converts a tile with y- and z-coordinates to a latitude.
 *
 * @param {number} y - The y-coordinate.
 * @param {number} z - The z-coordinate.
 * @returns {number} - The latitude.
 */
function tileToLat(y, z) {
  const n = Math.PI - (((2 * Math.PI) * y) / (2 ** z));
  return ((180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n))));
}

function getLatLong({ z, x, y }) {
  const latitude = tileToLat(y, z);
  const longitude = tileToLong(x, z);

  return [latitude, longitude];
}

module.exports = {
  getLatLong,
  tempToColor,
  tempToDegrees,
  tileToLat,
  tileToLong,
};
