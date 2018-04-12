/**
 * @see module:middleware
 * @module lib/converter
 */

/**
 * Converts temperature, in celsius, to degrees.
 *
 * @function
 * @param {number} temperature - temperature in celsius
 * @return {number} 0 - 360
 */
function tempToDegrees(temperature) {
  const temp = temperature > 50 ? 50 : temperature;

  /*
   * Creates the degrees, from a temperature range of -70 to 50.
   */
  let degrees = 300 - (((temp + 50) / 100) * 300);

  /*
   * Makes sure the degrees don't go above 360, which is mathematically impossible.
   */
  while (degrees > 360) {
    degrees -= 360;
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
  if (degrees < 60) {
    value = parseInt((degrees / 60) * 255, 10);
    return [255, value, 0];
  }

  if (degrees < 120) {
    value = 255 - parseInt((degrees / 120) * 255, 10);
    return [value, 255, 0];
  }

  if (degrees < 180) {
    value = parseInt((degrees / 180) * 255, 10);
    return [0, 255, value];
  }

  if (degrees < 240) {
    value = 255 - parseInt((degrees / 240) * 255, 10);
    return [0, value, 255];
  }

  if (degrees < 300) {
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
