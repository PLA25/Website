/**
 * @see module:lib
 * @module lib/generator
 */

const Jimp = require('jimp');
const distance = require('fast-haversine');

const {
  tempToColor,
  tileToLong,
  tileToLat,
} = require('./converter');

function generateImage(params, allSensorHubs, data) {
  const image = new Jimp(256, 256, 0x0);
  let rgb = [];

  const lat1 = tileToLat(params.y, params.z);
  const lon1 = tileToLong(params.x, params.z);
  const lat2 = tileToLat(parseInt(params.y, 10) - 1, params.z);
  const lon2 = tileToLong(parseInt(params.x, 10) - 1, params.z);

  const lat = (lat2 - lat1) / 2;
  const lon = (lon1 - lon2) / 2;

  const links = lon1 - lon;
  const boven = lat1 - lat;
  const rechts = lon1 + lon;
  const onder = lat1 + lat;

  const xMulti = (rechts - links) / 256;
  const yMulti = (boven - onder) / 256;

  const incr = 2 ** Math.max((15 - parseInt(params.z, 10)), 3);
  for (let x = 0; x < image.bitmap.width; x += incr) {
    for (let y = 0; y < image.bitmap.height; y += incr) {
      const latitude = onder + (yMulti * y);
      const longitude = links + (xMulti * x);

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
      for (let i = 0; i < selectedNodes.length; i += 1) {
        divider += (1 / parseFloat(selectedNodes[i].Distance, 10));
      }

      let calculatedValue = 0;
      for (let i = 0; i < selectedNodes.length; i += 1) {
        const sensorHub = selectedNodes[i];
        const dataNode = data[sensorHub.Index];

        const weight = (1 / sensorHub.Distance) / divider;
        calculatedValue += (parseFloat(dataNode.Value, 10) * weight);
      }

      rgb = tempToColor(calculatedValue);
      const color = Jimp.rgbaToInt(rgb[0], rgb[1], rgb[2], parseFloat(0.25 * 255));
      image.setPixelColor(color, x, y);

      for (let i = 1; i < incr; i += 1) {
        for (let l = 1; l < incr; l += 1) {
          image.setPixelColor(color, (x + i), (y + l));
        }
      }
    }
  }

  return image;
}

module.exports = { generateImage };
