const sensorHub = require('./../models/sensorhub');
const express = require('express');
const path = require('path');
const base64 = require('node-base64-image');
const fs = require('fs');

const router = express.Router();

router.get('/meetpunten', (req, res) => {
  sensorHub.find({}, (err, rawHubs) => {
    for (let i = 0; i < rawHubs.length; i += 1) {
      rawHubs[i].SerialID = rawHubs[i].SerialID.replace('\n', '');
    }

    res.render('meetpunten', {
      layout: false,
      sensorHubs: rawHubs,
    });
  });
});

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
      url = `https://tiles.planet.com/basemaps/v1/planet-tiles/global_monthly_2018_02_mosaic/gmap/${req.params.z}/${req.params.x}/${req.params.y}.png?api_key=44db310cea0743da8e73888c2d2d7b3f`;
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
    }, (err) => {
      if (err) {
        next(err);
        return;
      }

      res.sendFile(filePath);
    });
  });
});

router.get('*', (req, res) => {
  res.redirect('/map');
});

module.exports = router;
