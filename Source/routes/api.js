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
const {
  downloadImage,
} = require('./../helpers/image');

const cacheData = [];
function getCachedData(model, options) {
  return new Promise(((resolve, reject) => {
    const modelName = model.collection.name;
    if (cacheData[modelName] !== undefined) {
      resolve(cacheData[modelName]);
      return;
    }

    model.find(options).exec()
      .then((data) => {
        cacheData[modelName] = data;
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  }));
}

const tempCachePath = path.resolve(`${__dirname}./../cache/`);
router.get('*', (req, res, next) => {
  if (!fs.existsSync(tempCachePath)) {
    fs.mkdirSync(tempCachePath);
  }

  next();
});

/**
 * Renders a KML file containing all locations of the SensorHubs.
 *
 * @name Meetpunten
 * @path {GET} /api/meetpunten
 * @todo Change 'meetpunten' to an English name for consistency.
 */
router.get('/meetpunten', (req, res, next) => {
  getCachedData(SensorHub, {})
    .then((sensorHubs) => {
      res.set('Content-Type', 'application/vnd.google-earth.kml+xml');
      res.render('meetpunten', {
        layout: false,
        sensorHubs,
      });
    })
    .catch((err) => {
      next(err);
    });
});

/*
 * Handles Planet and Mapbox tile services,
 * also used for all cached images.
 *
 * @name ZXY
 * @path {GET} /api/:host/:z/:x/:y
 * @params {String} :host is the provider of the tile service.
 * @params {String} :z is the z-coordinate.
 * @params {String} :x is the x-coordinate.
 * @params {String} :y is the y-coordinate.
 */
router.get('/:host/:z/:x/:y', (req, res, next) => {
  const cachePath = path.resolve(`${tempCachePath}/${req.params.host}/`);
  if (!fs.existsSync(cachePath)) {
    fs.mkdirSync(cachePath);
  }

  const filePath = path.resolve(cachePath, `${req.params.z}_${req.params.x}_${req.params.y}.png`);
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

    case 'heatmap':
      next();
      return;

    default:
      res.status(404).sendFile(path.resolve(tempCachePath, '-1_-1_-1.png'));
      return;
  }

  downloadImage(url, {
    host: req.params.host,
    name: `${req.params.z}_${req.params.x}_${req.params.y}.png`,
  })
    .then((img) => {
      res.sendFile(img);
    })
    .catch((err) => {
      next(err);
    });
});

/**
 * Renders a 256x256 pixels PNG-image based,
 * on the temperature of the three nearest SensorHubs.
 *
 * @name Heatmap
 * @path {GET} /api/heatmap/:z/:x/:y
 * @params {String} :z is the z-coordinate.
 * @params {String} :x is the x-coordinate.
 * @params {String} :y is the y-coordinate.
 */
router.get('/heatmap/:z/:x/:y', (req, res, next) => {
  const filePath = path.resolve(`${tempCachePath}/heatmap/`, `${req.params.z}_${req.params.x}_${req.params.y}.png`);

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

        res.set('Content-Type', Jimp.MIME_PNG);
        res.send(buffer);
      });
    })
    .catch((err) => {
      next(err);
    });
});

/**
 * Redirects all unhandled request the the /map page.
 *
 * @name Unhandled
 * @path {ALL} /api/*
 */
router.all('*', (req, res) => {
  res.redirect('/map');
});

module.exports = router;
