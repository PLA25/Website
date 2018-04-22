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
router.get('/:host/:z/:x/:y', isLoggedIn, (req, res, next) => {
  const hosts = ['heatmap', 'mapbox', 'planet'];
  const { host } = req.params;
  const z = parseInt(req.params.z, 10);
  const x = parseInt(req.params.x, 10);
  const y = parseInt(req.params.y, 10);

  if (!hosts.includes(host)) {
    res.sendFile(errorImage);
    return;
  }

  const hostFolder = path.resolve(cacheFolder, host);
  if (!fs.existsSync(hostFolder)) {
    fs.mkdirSync(hostFolder);
  }

  const filePath = path.resolve(hostFolder, `${z}_${x}_${y}.png`);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
    return;
  }

  let url = '';
  switch (host) {
    case 'heatmap':
      next();
      return;
    case 'mapbox':
      url = `https://a.tiles.mapbox.com/v3/planet.jh0b3oee/${z}/${x}/${y}.png`;
      break;
    case 'planet':
      url = `https://tiles.planet.com/basemaps/v1/planet-tiles/global_monthly_2018_02_mosaic/gmap/${z}/${x}/${y}.png?api_key=${config.Planet.Key}`;
      break;

    default:
      res.sendFile(errorImage);
      return;
  }

  downloadImage(url, {
    host,
    name: `${z}_${x}_${y}.png`,
  })
    .then((img) => {
      res.sendFile(img);
    })
    .catch((err) => {
      next(err);
    });
});

/* Exports */
module.exports = router;
