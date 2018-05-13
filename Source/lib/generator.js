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

function getLatLong({
  z,
  x,
  y,
}) {
  const latitude = tileToLat(parseInt(y, 10), parseInt(z, 10));
  const longitude = tileToLong(parseInt(x, 10), parseInt(z, 10));

  return [latitude, longitude];
}

function getCalculatedValue(latitude, longitude, allSensorHubs, data) {
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

  return calculatedValue;
}

function getColorFromLatLong(latitude, longitude, allSensorHubs, data) {
  const calculatedValue = getCalculatedValue(latitude, longitude, allSensorHubs, data);
  const rgb = temperatureToColor(calculatedValue);
  return Jimp.rgbaToInt(rgb[0], rgb[1], rgb[2], parseFloat(0.25 * 255));
}

function getIncrement(z) {
  return Math.min(2 ** Math.max((15 - parseInt(z, 10)), 3), 128);
}

function generateImage(params, allSensorHubs, data) {
  return new Promise(((resolve, reject) => {
    const [lat1, lon1] = getLatLong(params);
    const [lat2, lon2] = getLatLong({
      z: parseInt(params.z, 10),
      x: parseInt(params.x, 10) - 1,
      y: parseInt(params.y, 10) - 1,
    });

    const lat = (lat2 - lat1) / 2;
    const lon = (lon1 - lon2) / 2;

    const links = lon1 - lon;
    const boven = lat1 - lat;
    const rechts = lon1 + lon;
    const onder = lat1 + lat;

    const xMulti = (rechts - links) / 256;
    const yMulti = (boven - onder) / 256;

    const image = new Jimp(256, 256, 0x0);
    if (data[0].Type == 'gasses') {
      const calculatedValue = Math.round(getCalculatedValue((onder + (yMulti * 128)), (links + (xMulti * 128)), allSensorHubs, data));

      Jimp.loadFont(Jimp.FONT_SANS_16_WHITE)
        .then((font) => {
          const text = `CO: ${calculatedValue} PPM`;
          const textWidth = measureText(font, text);

          for (let i = 0; i < (0 + (textWidth - 1)); i += 1) {
            for (let l = 0; l < 18; l += 1) {
              image.setPixelColor(Jimp.rgbaToInt(0, 0, 255, parseFloat(0.25 * 255)), i, l);
            }
          }

          image.print(font, 0, 0, text);

          resolve(image);
        });
    } else {
      const incr = Math.min(getIncrement(params.z), 8);
      for (let x = 0; x < image.bitmap.width; x += incr) {
        for (let y = 0; y < image.bitmap.height; y += incr) {
          const latitude = onder + (yMulti * y);
          const longitude = links + (xMulti * x);

          const color = getColorFromLatLong(latitude, longitude, allSensorHubs, data);

          image.setPixelColor(color, x, y);

          for (let i = 0; i < incr; i += 1) {
            for (let l = 0; l < incr; l += 1) {
              image.setPixelColor(color, (x + i), (y + l));
            }
          }
        }
      }

      resolve(image);
    }
  }));
}

function measureText(font, text) {
  let x = 0;
  for (let i = 0; i < text.length; i++) {
    if (font.chars[text[i]]) {
      x += font.chars[text[i]].xoffset
                + (font.kernings[text[i]] && font.kernings[text[i]][text[i + 1]] ? font.kernings[text[i]][text[i + 1]] : 0)
                + (font.chars[text[i]].xadvance || 0);
    }
  }
  return x;
}

module.exports = {
  generateImage,
  getColorFromLatLong,
  getIncrement,
};
