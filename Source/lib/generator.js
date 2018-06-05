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
  getIncrement,
  getLatLong,
  tileToLat,
  tileToLong,
  temperatureToColor,
} = require('./../helpers/converters');

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
  let inMarginValue = 0;
  selectedNodes.forEach((selectedNode) => {
    data.forEach((dataNode) => {
      if (dataNode.SensorHub == selectedNode.SerialID) {
        const weight = (1 / selectedNode.Distance) / divider;
        calculatedValue += (parseFloat(dataNode.Value, 10) * weight);
        inMarginValue += (parseInt(dataNode.inMargin, 10) * weight);
      }
    });
  });

  return { calculatedValue, inMarginValue };
}

function getColorFromLatLong(latitude, longitude, allSensorHubs, data) {
  const { calculatedValue, inMarginValue } = getCalculatedValue(latitude, longitude, allSensorHubs, data);
  const rgb = temperatureToColor(Math.min(Math.max(-50, calculatedValue), 50));

  return {
    color: Jimp.rgbaToInt(rgb[0], rgb[1], rgb[2], parseFloat(0.25 * 255)),
    inMargin: inMarginValue
  };
}

function generateImage(params, allSensorHubs, data, config) {
  return new Promise((resolve, reject) => {
    const treshold = parseFloat(config.value, 10);
    const z = parseInt(params.z, 10);
    const x = parseInt(params.x, 10);
    const y = parseInt(params.y, 10);

    const [lat1, lon1] = getLatLong({
      z,
      x,
      y
    });

    const [lat2, lon2] = getLatLong({
      z,
      x: (x - 1),
      y: (y - 1),
    });

    const lat = (Math.max(lat1, lat2) - Math.min(lat1, lat2)) / 2;
    const lon = (Math.max(lon1, lon2) - Math.min(lon1, lon2)) / 2;

    const left = lon1 - lon;
    const up = lat1 - lat;
    const right = lon1 + lon;
    const down = lat1 + lat;

    const xMulti = (right - left) / 256;
    const yMulti = (up - down) / 256;

    const image = new Jimp(256, 256, 0x0);
    if (data[0].Type == 'gasses') {
      let { calculatedValue, inMarginValue } = getCalculatedValue((down + (yMulti * 128)), (left + (xMulti * 128)), allSensorHubs, data);
      calculatedValue = Math.round(calculatedValue);

      Jimp.loadFont(Jimp.FONT_SANS_16_WHITE)
        .then((font) => {
          const text = ` CO: ${calculatedValue} PPM`;
          const textWidth = measureText(font, text);

          for (let x = 0; x < (0 + (textWidth - 1)); x += 1) {
            for (let y = 0; y < 18; y += 1) {
              if(inMarginValue < treshold) {
                image.setPixelColor(Jimp.rgbaToInt(255, 0, 0, parseFloat(1 * 255)), x, y);
              } else {
                image.setPixelColor(Jimp.rgbaToInt(0, 0, 0, parseFloat(1 * 255)), x, y);
              }
            }
          }

          image.print(font, 0, 0, text);
          resolve(image);
        });
    } else if (data[0].Type == 'light') {
      let { calculatedValue, inMarginValue } = getCalculatedValue((down + (yMulti * 128)), (left + (xMulti * 128)), allSensorHubs, data);
      calculatedValue = (Math.floor(calculatedValue / 1024 * 8)) - 1;
      calculatedValue = Math.min(calculatedValue, 7);
      calculatedValue = Math.max(calculatedValue, 0);

      const inMargin = (inMarginValue < treshold ? 0 : 1);

      Jimp.read(`./public/bulb_${calculatedValue}_${inMargin}.png`)
        .then((bulb) => {
          for (let x = (256 - 64); x < 256; x += 1) {
            for (let y = 64; y > 0; y -= 1) {
              image.setPixelColor(bulb.getPixelColor(x - (256 - 64), 64 - y), x, 64 - y);
            }
          }

          resolve(image);
        });
    } else if (data[0].Type == 'temperature') {
      const incr = 16;//Math.min(getIncrement(z), 8);
      let showWarn = [];
      for (let x = 0; x < image.bitmap.width; x += incr) {
        for (let y = 0; y < image.bitmap.height; y += incr) {
          const latitude = down + (yMulti * y);
          const longitude = left + (xMulti * x);

          const {
            color,
            inMargin,
          } = getColorFromLatLong(latitude, longitude, allSensorHubs, data);

          if (inMargin < treshold) {
            showWarn.push([x, y]);
          }

          image.setPixelColor(color, x, y);

          for (let i = 0; i < incr; i += 1) {
            for (let l = 0; l < incr; l += 1) {
              image.setPixelColor(color, (x + i), (y + l));
            }
          }

        }
      }

      if (showWarn.length > 0) {
        Jimp.read(`./public/warning.png`, function (err, warning) {
          warning.resize(incr, incr);
          for (let i = 0; i < showWarn.length; i++) {
            const pos = showWarn[i];
            image.composite(warning, pos[0], pos[1]);
          }

          resolve(image);
        });
      } else {
        resolve(image)
      }


    }
  });
}

function measureText(font, text) {
  let x = 0;

  for (let i = 0; i < text.length; i++) {
    x += font.chars[text[i]].xoffset;
    x += font.chars[text[i]].xadvance;
  }

  return x;
}

module.exports = {
  generateImage,
  getColorFromLatLong,
};
