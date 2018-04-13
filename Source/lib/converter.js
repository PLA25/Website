/**
 * @see module:middleware
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
  return (300 - (((temp + 50) / 100) * 300));
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
  if (degrees <= 60) {
    value = parseInt((degrees / 60) * 255, 10);
    return [255, value, 0];
  }

  if (degrees <= 120) {
    value = 255 - parseInt((degrees / 120) * 255, 10);
    return [value, 255, 0];
  }

  if (degrees <= 180) {
    value = parseInt((degrees / 180) * 255, 10);
    return [0, 255, value];
  }

  if (degrees <= 240) {
    value = 255 - parseInt((degrees / 240) * 255, 10);
    return [0, value, 255];
  }

  if (degrees <= 300) {
    value = parseInt((degrees / 300) * 255, 10);
    return [value, 0, 255];
  }

  /*
   * The determined value if the degrees are higher than 300.
   */
  value = 255 - parseInt((degrees / 120) * 255, 10);
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

module.exports = {
  tempToDegrees, tempToColor, tileToLat, tileToLong,
};
