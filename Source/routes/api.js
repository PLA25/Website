/** Requires all necessary modules for the API. */
const express = require('express');
const path = require('path');
const fs = require('fs');
const base64 = require('node-base64-image');
const distance = require('fast-haversine');
const Jimp = require('jimp');

// eslint-disable-next-line import/no-unresolved, import/no-extraneous-dependencies
const config = require('./../config');

const SensorHub = require('./../models/sensorhub');
const Data = require('./../models/data');

/** Creates router instance for this route. */
const router = express.Router();

/**
 * Converts temperature to degrees.
 * @param {number} temp - The temperature.
 * @returns {number} degress - The degrees.
 */
function tempToDegrees(temp) {
  /** Creates the degrees, from a temperature range of -70 to 50. */
  let degrees = 300 - (((temp + 50) / 100) * 300);

  /** Makes sure the degrees don't go above 360, which is mathematically impossible. */
  while (degrees > 360) {
    degrees -= 360;
  }

  /** Returns the degrees. */
  return degrees;
}

/**
 * Converts temperature to color.
 * @param {number} temp - The temperature.
 * @returns [{number}, {number}, {number}] color
 */
function tempToColor(temp) {
  /** Finds the degrees for further conversion. */
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

  /** The determined value if the degrees are higher than 300. */
  value = 255 - parseInt((degrees / 120) * 255, 10);
  return [255, 0, value];
}

/**
 * @param options
 * @todo Change 'GetData' to 'getData' in accordance of code style.
 */
function GetData(options) {
  return new Promise((resolve, reject) => {
    Data.findOne(options, (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(data);
    });
  });
}

/**
 * Converts a tile with x- and z-coordinates to a longitude.
 * @param {number} x - The x-coordinate.
 * @param {number} z - The z-coordinate.
 * @returns {number} - The longitude.
 * @todo Change 'tile2long' to 'tileToLong' or 'tileToLongtitude' for the sake of consistency.
 */
function tile2long(x, z) {
  return (((x / (2 ** z)) * 360) - 180);
}

/**
 * Converts a tile with y- and z-coordinates to a latitude.
 * @param {number} y - The y-coordinate.
 * @param {number} z - The z-coordinate.
 * @returns {number} - The latitude.
 * @todo Change 'tile2lat' to 'tileToLat' or 'tileToLatitude' for the sake of consistency.
 */
function tile2lat(y, z) {
  const n = Math.PI - (((2 * Math.PI) * y) / (2 ** z));
  return ((180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n))));
}

router.get('/heatmap/:z/:x/:y', (req, res, next) => {
  SensorHub.find({}).exec()
    .then((sensorHubs) => {
      const latitude = tile2lat(req.params.y, req.params.z);
      const longitude = tile2long(req.params.x, req.params.z);

      const calculatedHubs = [];
      for (let i = 0; i < sensorHubs.length; i += 1) {
        const sensorHub = sensorHubs[i];

        const from = {
          lat: parseFloat(sensorHub.Latitude, 10),
          lon: parseFloat(sensorHub.Longitude, 10),
        };

        const to = {
          lat: parseFloat(latitude, 10),
          lon: parseFloat(longitude, 10),
        };

        sensorHub.Distance = distance(from, to);
        calculatedHubs.push(sensorHub);
      }

      return calculatedHubs.sort((a, b) => a.Distance - b.Distance).slice(0, 3);
    })
    .then((selectedNodes) => {
      const promises = [];
      for (let i = 0; i < selectedNodes.length; i += 1) {
        promises.push(GetData({
          Type: 'temperature',
          SensorHub: selectedNodes[i].SerialID,
        }));
      }

      return Promise.all(promises).then(data => [selectedNodes, data]);
    })
    .then(([selectedNodes, data]) => {
      let divider = 0;
      for (let i = 0; i < selectedNodes.length; i += 1) {
        divider += (1 / parseFloat(selectedNodes[i].Distance, 10));
      }

      let calculatedValue = 0;
      for (let i = 0; i < data.length; i += 1) {
        const dataNode = data[i];
        const sensorHub = selectedNodes[i];

        const weight = (1 / sensorHub.Distance) / divider;
        calculatedValue += (parseFloat(dataNode.Value, 10) * weight);
      }

      return calculatedValue;
    })
    .then((calculatedValue) => {
      const image = new Jimp(256, 256, 0x0);
      const rgb = tempToColor(calculatedValue);

      for (let x = 0; x < 256; x += 1) {
        for (let y = 0; y < 256; y += 1) {
          image.setPixelColor(Jimp.rgbaToInt(rgb[0], rgb[1], rgb[2], parseFloat(0.25 * 255)), x, y);
        }
      }

      image.getBuffer(Jimp.MIME_PNG, (err, buffer) => {
        if (err) {
          next(err);
          return;
        }

        res.set('Content-Type', Jimp.MIME_PNG);
        res.send(buffer);
      });
    })
    .catch((err) => {
      next(err);
    });
});

/**
 * Creates route for meetpunten.
 * @todo Change 'meetpunten' to an English name for consistency.
 */
router.get('/meetpunten', (req, res, next) => {
  SensorHub.find({}).exec()
    .then((sensorHubs) => {
      res.render('meetpunten', {
        layout: false,
        sensorHubs,
      });
    })
    .catch((err) => {
      next(err);
    });
});

/** Handles caching. */
router.get('/:host/:z/:x/:y', (req, res, next) => {
  const tempCachePath = path.resolve(`${__dirname}./../cache/`);
  if (!fs.existsSync(tempCachePath)) {
    fs.mkdirSync(tempCachePath);
  }

  const cachePath = path.resolve(`${tempCachePath}/${req.params.host}/`);
  if (!fs.existsSync(cachePath)) {
    fs.mkdirSync(cachePath);
  }

  const filePath = path.resolve(cachePath, `${req.params.z}_${req.params.x}_${req.params.y}.jpg`);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
    return;
  }

  let url = '';
  switch (req.params.host) {
    case 'planet':
      url = `https://tiles.planet.com/basemaps/v1/planet-tiles/global_monthly_2018_02_mosaic/gmap/${req.params.z}/${req.params.x}/${req.params.y}.png?api_key=${config.Planet.Key}`;
      break;

    case 'mapbox':
      url = `https://a.tiles.mapbox.com/v3/planet.jh0b3oee/${req.params.z}/${req.params.x}/${req.params.y}.png`;
      break;

    default:
      res.sendFile(path.resolve(cachePath, '-1_-1_-1.jpg'));
      return;
  }

  base64.encode(url, {
    string: false,
  }, (err, image) => {
    if (err) {
      next(err);
      return;
    }

    base64.decode(image, {
      filename: filePath.replace('.jpg', ''),
    }, (err2) => {
      if (err2) {
        next(err);
        return;
      }

      res.sendFile(filePath);
    });
  });
});

/** Redirects * to the map page. */
router.get('*', (req, res) => {
  res.redirect('/map');
});

module.exports = router;
