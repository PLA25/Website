/**
 * API route
 *
 * @module routes/api
 * @see module:routes
 */

/* Config */
const config = require('./../config/all');

/* Packages */
const express = require('express');
const path = require('path');
const fs = require('fs');
const base64 = require('node-base64-image');
const Jimp = require('jimp');

/* Models */
const Data = require('./../models/data');
const SensorHub = require('./../models/sensorhub');

/* Constants */
const router = express.Router();

/* Helpers */
const {
  generateImage,
} = require('./../lib/generator');

let cacheSensorHubs = null;

function getCachedSensorHubs(options) {
  return new Promise((resolve, reject) => {
    if (cacheSensorHubs !== null) {
      resolve(cacheSensorHubs);
      return;
    }

    SensorHub.find(options).exec()
      .then((sensorHubs) => {
        cacheSensorHubs = sensorHubs;
        resolve(sensorHubs);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

let cacheData = null;

function getCachedData(options) {
  return new Promise((resolve, reject) => {
    if (cacheData !== null) {
      resolve(cacheData);
      return;
    }

    Data.find(options).exec()
      .then((data) => {
        cacheData = data;
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

const tempCachePath = path.resolve(`${__dirname}./../cache/`);
router.get('*', (req, res, next) => {
  if (!fs.existsSync(tempCachePath)) {
    fs.mkdirSync(tempCachePath);
  }

  next();
});

router.get('/heatmap/:z/:x/:y', (req, res, next) => {
  const cachePath = path.resolve(`${tempCachePath}/heatmap/`);
  if (!fs.existsSync(cachePath)) {
    fs.mkdirSync(cachePath);
  }

  const filePath = path.resolve(cachePath, `${req.params.z}_${req.params.x}_${req.params.y}.png`);

  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
    return;
  }

  getCachedSensorHubs({})
    .then(allSensorHubs => getCachedData({}).then(data => [allSensorHubs, data]))
    .then(([allSensorHubs, data]) => {
      const image = generateImage(req.params, allSensorHubs, data);
      // image.write(filePath);
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

/* Handles caching. */
router.get('/:host/:z/:x/:y', (req, res, next) => {
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

/* Redirects * to the map page. */
router.get('*', (req, res) => {
  res.redirect('/map');
});

module.exports = router;
