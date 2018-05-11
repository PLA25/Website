/**
 * API controller
 *
 * @module controllers/api
 * @see module:controllers
 */

/* Config */
const config = require('./../config/all');

/* Packages */
const express = require('express');
const fs = require('fs');
const Jimp = require('jimp');
const path = require('path');

/* Models */
const Data = require('./../models/data');
const SensorHub = require('./../models/sensorhub');

/* Constants */
const router = express.Router();

/* Middlewares */
const {
  isLoggedIn,
} = require('./../middlewares');

/* Helpers */
const {
  downloadImage,
} = require('./../helpers/image');
const {
  generateImage,
} = require('./../lib/generator');

const cacheData = [];

/**
 * Checks if the requested data already exists in the cache;
 * if it doesn't exist fetch and save in the cache.
 *
 * @function
 * @param {Object} model - Model object from MongoDB.
 * @param {Object} options - Any options for the request.
 * @returns {Object} - returns the saved object.
 */
function getCachedData(model) {
  return new Promise(((resolve, reject) => {
    const modelName = model.collection.name;
    if (cacheData[modelName] !== undefined) {
      resolve(cacheData[modelName]);
      return;
    }
    model.find({ Timestamp: ['2018-05-09T12:00:00.000Z'] }).exec()
      .then((data) => {
        cacheData[modelName] = data;
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  }));
}

/*
 * Cache pad, the other is in /helpers/image.js
 */
const cacheFolder = path.resolve(`${__dirname}./../cache/`);
router.use((req, res, next) => {
  if (!fs.existsSync(cacheFolder)) {
    fs.mkdirSync(cacheFolder);
  }

  next();
});

const errorImage = path.resolve(cacheFolder, '-1_-1_-1.png');
router.use((req, res, next) => {
  if (!fs.existsSync(errorImage)) {
    const image = new Jimp(256, 256, 0x0);
    image.write(errorImage);
  }

  next();
});

router.get('/mapbox/:z/:x/:y', isLoggedIn, (req, res, next) => {
  const z = parseInt(req.params.z, 10);
  const x = parseInt(req.params.x, 10);
  const y = parseInt(req.params.y, 10);

  const hostFolder = path.resolve(cacheFolder, 'mapbox');
  if (!fs.existsSync(hostFolder)) {
    fs.mkdirSync(hostFolder);
  }

  const filePath = path.resolve(hostFolder, `${z}_${x}_${y}.png`);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
    return;
  }

  downloadImage(`https://a.tiles.mapbox.com/v3/planet.jh0b3oee/${z}/${x}/${y}.png`, {
    host: 'mapbox',
    name: `${z}_${x}_${y}.png`,
  })
    .then((img) => {
      res.sendFile(img);
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/:datetime/planet/:z/:x/:y', isLoggedIn, (req, res, next) => {
  const z = parseInt(req.params.z, 10);
  const x = parseInt(req.params.x, 10);
  const y = parseInt(req.params.y, 10);

  const hostFolder = path.resolve(cacheFolder, 'planet');
  if (!fs.existsSync(hostFolder)) {
    fs.mkdirSync(hostFolder);
  }

  const unixTimestamp = parseInt(req.params.datetime, 10);
  let currentdate = new Date(Math.floor(unixTimestamp / 1000 / 60 / 60 / 24) * 1000 * 60 * 60 * 24);
  currentdate = currentdate.getTime() - (currentdate.getDate() * 24 * 60 * 60 * 1000);
  const date = new Date(currentdate);
  const unix = date.getTime();

  const filePath = path.resolve(hostFolder, `${unix}_${z}_${x}_${y}.png`);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
    return;
  }

  const today = new Date();
  const month = today.getMonth(); // Jan = 0, Dec = 11
  const year = today.getFullYear();

  if (date.getFullYear() > year || (date.getMonth() > month && date.getFullYear === year)) {
    res.sendFile(errorImage);
    return;
  }

  let requestedYear = date.getFullYear();
  let requestedMonth = (date.getMonth() + 2) % 12;
  requestedMonth = requestedMonth === 0 ? 12 : requestedMonth;

  if (requestedMonth >= month && requestedYear === year) {
    requestedMonth = month - 1;
  }

  if (requestedMonth === 1) {
    requestedYear += 1;
  }

  const planetYear = requestedYear;
  const planetMonth = `0${requestedMonth}`.slice(-2);
  const url = `https://tiles.planet.com/basemaps/v1/planet-tiles/global_monthly_${planetYear}_${planetMonth}_mosaic/gmap/${z}/${x}/${y}.png?api_key=${config.Planet.Key}`;

  downloadImage(url, {
    host: 'planet',
    name: `${unix}_${z}_${x}_${y}.png`,
  })
    .then((img) => {
      res.sendFile(img);
    })
    .catch((err) => {
      next(err);
    });
});

/**
 * Renders a 256x256 pixels PNG-image based on the temperature
 * of the five nearest SensorHubs.
 *
 * @name Heatmap
 * @path {GET} /api/heatmap/:z/:x/:y
 * @params {String} :z is the z-coordinate.
 * @params {String} :x is the x-coordinate.
 * @params {String} :y is the y-coordinate.
 */
router.get('/:datetime/heatmap/:z/:x/:y', (req, res, next) => {
  const datetime = parseInt(req.params.datetime, 10);
  const z = parseInt(req.params.z, 10);
  const x = parseInt(req.params.x, 10);
  const y = parseInt(req.params.y, 10);
  const filePath = path.resolve(cacheFolder, 'heatmap', `${datetime}_${z}_${x}_${y}.png`);

  getCachedData(SensorHub, {})
    .then(allSensorHubs => getCachedData(Data, {}).then(data => [allSensorHubs, data]))
    .then(([allSensorHubs, data]) => {
      const image = generateImage(req.params, allSensorHubs, data);
      image.write(filePath);
      image.getBuffer(Jimp.MIME_PNG, (err, buffer) => {
        if (err) {
          next(err);
          return;
        }

        res.send(buffer);
      });
    })
    .catch((err) => {
      next(err);
    });
});

/**
 * Renders a KML file containing the locations of all SensorHubs.
 *
 * @name SensorHubs
 * @path {GET} /api/sensorhubs
 */
router.get('/sensorhubs', isLoggedIn, (req, res, next) => {
  getCachedData(SensorHub, {})
    .then((sensorHubs) => {
      res.render('sensorhubs', {
        layout: false,
        SensorHubs: sensorHubs,
      });
    })
    .catch((err) => {
      next(err);
    });
});

/* Exports */
module.exports = router;
