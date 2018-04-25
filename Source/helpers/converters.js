/**
 * @see module:helpers
 * @module helpers/converters
 */

/**
 * Converts the given input to degrees, using the provided min and max values.
 *
 * @function
 * @param {Number} input - Variable to convert to degrees.
 * @param {Number} min - Minimum value of the range.
 * @param {Number} max - Maximu value of the range.
 * @returns {Number} - Returns a between or equal to 0 - 360.
 */
function calculateDegrees(input, min, max) {
  if (typeof input !== 'number') {
    throw new Error('Expected \'input\' to be a number!');
  }

  if (typeof min !== 'number') {
    throw new Error('Expected \'min\' to be a number!');
  }

  if (typeof max !== 'number') {
    throw new Error('Expected \'max\' to be a number!');
  }

  if (input < Math.min(min, max)) {
    throw new Error('Expected \'input\' to be equal to or between \'min\' and or \'max\'!');
  }

  if (input > Math.max(min, max)) {
    throw new Error('Expected \'input\' to be equal to or between \'min\' and or \'max\'!');
  }

  const range = Math.max(min, max) - Math.min(min, max);
  return Math.round(((input - Math.min(min, max)) / range) * 360);
}

/**
 * Converts degrees to a color (RGB).
 *
 * @function
 * @param {Number} degrees - Degrees to convert to a color.
 * @returns {Number[]} - Red, Green and Blue
 */
function degreesToColor(degrees) {
  if (typeof degrees !== 'number') {
    throw new Error('Expected \'degrees\' to be a number!');
  }

  if (degrees < 0 || degrees > 360) {
    throw new Error('Expected \'degrees\' to be within 0 - 360!');
  }

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
 * Converts temperature, in °C, to a color (RGB).
 *
 * @function
 * @param {Number} temperature - Temperature to convert to a color.
 * @returns {Number[]} - Red, Green and Blue
 */
function temperatureToColor(temperature) {
  if (typeof temperature !== 'number') {
    throw new Error('Expected \'temperature\' to be a number!');
  }

  if (temperature < -50 || temperature > 50) {
    throw new Error('Expected \'temperature\' to be equal to or between -50°C and or 50°C!');
  }

  const degrees = temperatureToDegrees(temperature);
  return degreesToColor(degrees);
}

/**
 * Converts temperature, in °C, to degrees.
 *
 * @function
 * @param {Number} temperature - Temperature to convert to degrees.
 * @returns {Number} 0 - 300
 */
function temperatureToDegrees(temperature) {
  if (typeof temperature !== 'number') {
    throw new Error('Expected \'temperature\' to be a number!');
  }

  if (temperature < -50 || temperature > 50) {
    throw new Error('Expected \'temperature\' to be equal to or between -50°C and or 50°C!');
  }

  const degrees = calculateDegrees(temperature, -50, 50);
  return Math.round(((360 - degrees) / 360) * 300);
}

/**
 * Converts a tile with y- and z-coordinates to a latitude.
 *
 * @param {Number} y - The y-coordinate.
 * @param {Number} z - The z-coordinate.
 * @returns {Number} - The latitude.
 */
function tileToLat(y, z) {
  if (typeof y !== 'number') {
    throw new Error('Expected \'y\' to be a number!');
  }

  if (typeof z !== 'number') {
    throw new Error('Expected \'z\' to be a number!');
  }

  const n = Math.PI - (((2 * Math.PI) * (y + 0.75)) / (2 ** z));
  return ((180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n))));
}

/**
 * Converts a tile with x- and z-coordinates to a longitude.
 *
 * @param {Number} x - The x-coordinate.
 * @param {Number} z - The z-coordinate.
 * @returns {Number} - The longitude.
 */
function tileToLong(x, z) {
  if (typeof x !== 'number') {
    throw new Error('Expected \'x\' to be a number!');
  }

  if (typeof z !== 'number') {
    throw new Error('Expected \'z\' to be a number!');
  }

  return ((((x + 0.75) / (2 ** z)) * 360) - 180);
}

module.exports = {
  calculateDegrees,
  degreesToColor,
  temperatureToColor,
  temperatureToDegrees,
  tileToLat,
  tileToLong,
};
