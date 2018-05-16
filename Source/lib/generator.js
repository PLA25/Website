/* eslint-disable */

/**
 * @see module:lib
 * @module lib/generator
 * @todo Documentation
 * @todo Unit Tests
 */

const Jimp = require('jimp');
const distance = require('fast-haversine');

const {
  tileToLat,
  tileToLong,
  temperatureToColor,
} = require('./../helpers/converters');

function getLatLong({ z, x, y }) {
  const latitude = tileToLat(parseInt(y, 10), parseInt(z, 10));
  const longitude = tileToLong(parseInt(x, 10), parseInt(z, 10));

  return [latitude, longitude];
}

function getColorFromLatLong(latitude, longitude, allSensorHubs, data) {
  const to = {
    lat: parseFloat(latitude, 10),
    lon: parseFloat(longitude, 10),
  };

  const calculatedHubs = [];
  for (let i = 0; i < allSensorHubs.length; i += 1) {
    const sensorHub = allSensorHubs[i].toObject();

    const from = {
      lat: parseFloat(sensorHub.Latitude, 10),
      lon: parseFloat(sensorHub.Longitude, 10),
    };

    sensorHub.Index = i;
    sensorHub.Distance = distance(from, to);
    calculatedHubs.push(sensorHub);
  }

  const selectedNodes = calculatedHubs.sort((a, b) => a.Distance - b.Distance).slice(0, 5);

  let divider = 0;
  selectedNodes.forEach((selectedNode) => {
    divider += (1 / parseFloat(selectedNode.Distance, 10));
  });

  let calculatedValue = 0;
  selectedNodes.forEach((selectedNode) => {
    const dataNode = data[selectedNode.Index];

    const weight = (1 / selectedNode.Distance) / divider;
    calculatedValue += (parseFloat(dataNode.Value, 10) * weight);
  });

  const rgb = temperatureToColor(calculatedValue);
  return Jimp.rgbaToInt(rgb[0], rgb[1], rgb[2], parseFloat(0.25 * 255));
}

function getIncrement(z) {
  return Math.min(2 ** Math.max((15 - parseInt(z, 10)), 3), 128);
}

function generateImage(params, allSensorHubs, data) {
  const [lat1, lon1] = getLatLong(params);
  const [lat2, lon2] = getLatLong({
    z: parseInt(params.z, 10),
    x: parseInt(params.x, 10) - 1,
    y: parseInt(params.y, 10) - 1,
  });

  const lat = (lat2 - lat1) / 2;
  const lon = (lon1 - lon2) / 2;

  const left = lon1 - lon;
  const up = lat1 - lat;
  const right = lon1 + lon;
  const down = lat1 + lat;

  const xMulti = (right - left) / 256;
  const yMulti = (up - down) / 256;

  const image = new Jimp(256, 256, 0x0);

  const incr = Math.min(getIncrement(params.z), 8);
  for (let x = 0; x < image.bitmap.width; x += incr) {
    for (let y = 0; y < image.bitmap.height; y += incr) {
      const latitude = down + (yMulti * y);
      const longitude = left + (xMulti * x);

      const color = getColorFromLatLong(latitude, longitude, allSensorHubs, data);

      image.setPixelColor(color, x, y);

      for (let i = 0; i < incr; i += 1) {
        for (let l = 0; l < incr; l += 1) {
          image.setPixelColor(color, (x + i), (y + l));
        }
      }
    }
  }

  return image;
}

module.exports = {
  generateImage,
  getColorFromLatLong,
  getIncrement,
};
