/**
 * API route
 *
 * @module routes/api
 * @see module:routes
 */

const config = require('./../config/all');

/* Packages */
const express = require('express');
const path = require('path');
const fs = require('fs');
const base64 = require('node-base64-image');
const distance = require('fast-haversine');
const Jimp = require('jimp');

/* Models */
const Data = require('./../models/data');
const SensorHub = require('./../models/sensorhub');

/* Constants */
const router = express.Router();

/* Helpers */
const { tempToColor, tileToLong, tileToLat } = require('./../lib/converter');

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

router.get('/heatmap/:z/:x/:y', (req, res, next) => {
  const tempCachePath = path.resolve(`${__dirname}./../cache/`);
  if (!fs.existsSync(tempCachePath)) {
    fs.mkdirSync(tempCachePath);
  }

  const cachePath = path.resolve(`${tempCachePath}/heatmap/`);
  if (!fs.existsSync(cachePath)) {
    fs.mkdirSync(cachePath);
  }

  const filePath = path.resolve(cachePath, `${req.params.z}_${req.params.x}_${req.params.y}.png`);

  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
    return;
  }

  SensorHub.find({}).exec()
    .then((sensorHubs) => {
      const latitude = tileToLat(req.params.y, req.params.z);
      const longitude = tileToLong(req.params.x, req.params.z);

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

      return calculatedHubs.sort((a, b) => a.Distance - b.Distance).slice(0, 5);
    })
    .then((allSensorHubs) => {
      const promises = [];

      allSensorHubs.forEach((sensorHub) => {
        promises.push(GetData({
          Type: 'temperature',
          SensorHub: sensorHub.SerialID,
        }));
      });

      return Promise.all(promises).then(data => [allSensorHubs, data]);
    })
    .then(([allSensorHubs, data]) => {
      const lat1 = tileToLat(req.params.y, req.params.z);
      const lon1 = tileToLong(req.params.x, req.params.z);
      const lat2 = tileToLat(parseInt(req.params.y, 10) - 1, req.params.z);
      const lon2 = tileToLong(parseInt(req.params.x, 10) - 1, req.params.z);

      const lat = (lat2 - lat1) / 2;
      const lon = (lon1 - lon2) / 2;

      const links = lon1 - lon;
      const boven = lat1 - lat;
      const rechts = lon1 + lon;
      const onder = lat1 + lat;

      const xMulti = (rechts - links) / 256;
      const yMulti = (boven - onder) / 256;

      const image = new Jimp(256, 256, 0x0);

      let rgb = [];
      for (let x = 0; x < 256; x += 1) {
        for (let y = 0; y < 256; y += 1) {
          // if(y % 1 == 0 && x % 1 == 0) {
          const selectedNodes = [];

          const latitude = onder + (yMulti * y);
          const longitude = links + (xMulti * x);

          const to = {
            lat: parseFloat(latitude, 10),
            lon: parseFloat(longitude, 10),
          };

          for (let i = 0; i < allSensorHubs.length; i += 1) {
            const sensorHub = allSensorHubs[i].toObject();

            const from = {
              lat: parseFloat(sensorHub.Latitude, 10),
              lon: parseFloat(sensorHub.Longitude, 10),
            };

            sensorHub.Index = i;
            sensorHub.Distance = distance(from, to);
            selectedNodes.push(sensorHub);
          }

          const calculatedHubs = selectedNodes;

          let divider = 0;
          calculatedHubs.forEach((calculatedHub) => {
            divider += (1 / parseFloat(calculatedHub.Distance, 10));
          });

          let calculatedValue = 0;
          calculatedHubs.forEach((calculatedHub) => {
            const dataNode = data[calculatedHub.Index];
            const weight = (1 / calculatedHub.Distance) / divider;

            calculatedValue += (parseFloat(dataNode.Value, 10) * weight);
          });

          rgb = tempToColor(calculatedValue);
          // }
          image.setPixelColor(Jimp.rgbaToInt(rgb[0], rgb[1], rgb[2], parseFloat(0.25 * 255)), x, y);
        }
      }

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
