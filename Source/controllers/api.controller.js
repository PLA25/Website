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
const Config = require('./../models/config');

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

/**
 * Handles the Mapbox tile services;
 * also used for caching the tiles.
 *
 * @name Mapbox
 * @path {GET} /api/mapbox/:z/:x/:y
 * @params {String} :z is the z-coordinate.
 * @params {String} :x is the x-coordinate.
 * @params {String} :y is the y-coordinate.
 */
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

/**
 * Handles the Planet tile services;
 * also used for caching the tiles.
 *
 * @name Planet
 * @path {GET} /api/planet/:datetime/:z/:x/:y
 * @params {String} :dateTime unix-timestamp.
 * @params {String} :z is the z-coordinate.
 * @params {String} :x is the x-coordinate.
 * @params {String} :y is the y-coordinate.
 */
router.get('/planet/:dateTime/:z/:x/:y', isLoggedIn, (req, res, next) => {
  const z = parseInt(req.params.z, 10);
  const x = parseInt(req.params.x, 10);
  const y = parseInt(req.params.y, 10);

  const hostFolder = path.resolve(cacheFolder, 'planet');
  if (!fs.existsSync(hostFolder)) {
    fs.mkdirSync(hostFolder);
  }

  const unixTimestamp = parseInt(req.params.dateTime, 10);
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

  if (date.getFullYear() > year || (date.getMonth() > month && date.getFullYear() === year)) {
    res.status(500);
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
 * Handles the pop-menu data.
 *
 * @name Data
 * @path {GET} /api/data/:sensorHub/:dateTime
 * @params {String} :sensorHub SensorHub to get data from.
 * @params {String} :dateTime unix-timestamp.
 */
router.get('/data/:sensorHub/:dateTime', isLoggedIn, (req, res, next) => {
  const serialID = req.params.sensorHub;
  const unixTimestamp = parseInt(req.params.dateTime, 10);
  const requestedDate = new Date((Math.round(unixTimestamp / 1000 / 60 / 60)) * 1000 * 60 * 60);

  SensorHub.findOne({
    SerialID: serialID,
  }).exec().then((sensorHub) => {
    if (sensorHub == null) {
      next(new Error());
      return;
    }

    // eslint-disable-next-line consistent-return
    return Data.find({
      SensorHub: sensorHub.SerialID,
      Timestamp: {
        $gt: new Date(requestedDate.getTime() - (24 * 60 * 60 * 1000)),
        $lte: new Date(requestedDate.getTime()),
      },
    }).sort({
      Timestamp: -1,
    }).exec().then(data => data);
  })
    .then((data) => {
      const result = [
        [
          [],
          [],
        ],
        [
          [],
          [],
        ],
        [
          [],
          [],
        ],
      ];

      data.forEach((dataNode) => {
        const type = dataNode.Type;

        let index;
        if (type === 'temperature') {
          index = 0;
        } else if (type === 'gasses') {
          index = 1;
        } else {
          index = 2;
        }

        result[index][0].push(new Date(dataNode.Timestamp).toISOString());
        result[index][1].push(parseInt(dataNode.Value, 10));
      });

      res.type('json');
      res.send(JSON.stringify(result));
    })
    .catch((err) => {
      next(err);
    });
});

/**
 * Handles the PDS tile services;
 * also used for caching the tiles.
 *
 * @name Type
 * @path {GET} /:type/:dateTime/:z/:x/:y
 * @params {String} :type type of data.
 * @params {String} :dateTime unix-timestamp.
 * @params {String} :z is the z-coordinate.
 * @params {String} :x is the x-coordinate.
 * @params {String} :y is the y-coordinate.
 */
router.get('/:type/:dateTime/:z/:x/:y', isLoggedIn, (req, res, next) => {
  /*
   * const z = parseInt(req.params.z, 10);
   * const x = parseInt(req.params.x, 10);
   * const y = parseInt(req.params.y, 10);
   */
  const {
    type,
  } = req.params;

  const types = ['gasses', 'light', 'temperature'];
  if (!types.includes(type)) {
    res.status(501);
    res.sendFile(errorImage);
    return;
  }

  const hostFolder = path.resolve(cacheFolder, type);
  if (!fs.existsSync(hostFolder)) {
    fs.mkdirSync(hostFolder);
  }

  const unixTimestamp = parseInt(req.params.dateTime, 10);
  const requestedDate = new Date((Math.round(unixTimestamp / 1000 / 60 / 60)) * 1000 * 60 * 60);
  /*
   * const filePath = path.resolve(hostFolder, `${requestedDate.getTime()}_${z}_${x}_${y}.png`);
   * if (fs.existsSync(filePath)) {
   * res.type('png');
   * res.sendFile(filePath);
   * return;
   * }
   */

  SensorHub.find({}).exec()
    .then(sensorHubs => Data.find({
      Type: type,
      Timestamp: {
        $gt: new Date(requestedDate.getTime() - (30 * 60 * 1000)),
        $lte: new Date(requestedDate.getTime() + (30 * 60 * 1000)),
      },
    }).exec().then(data => [sensorHubs, data]))
    .then(([sensorHubs, data]) => Config.findOne({
      valueID: `treshold-${type}`,
    }).exec().then(treshold => [sensorHubs, data, treshold]))
    .then(([sensorHubs, data, treshold]) => generateImage(req.params, sensorHubs, data, treshold))
    .then((image) => {
      /*
       * image.write(filePath);
       */
      image.getBuffer(Jimp.MIME_PNG, (err, buffer) => {
        if (err) {
          next(err);
        } else {
          res.type('png');
          res.send(buffer);
        }
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
  SensorHub.find({}).exec()
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

/**
 * Sends the errorImage to the user for any unhandled request.
 *
 * @name 404
 * @path {ALL} /api/*
 */
router.all('*', isLoggedIn, (req, res) => {
  res.status(404);
  res.sendFile(errorImage);
});

/* Exports */
module.exports = router;
