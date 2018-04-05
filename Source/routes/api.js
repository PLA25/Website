const express = require('express');
const path = require('path');
const fs = require('fs');
const base64 = require('node-base64-image');
const pngjs = require('pngjs-image');
const distance = require('fast-haversine');
const Jimp = require('jimp');

// eslint-disable-next-line import/no-unresolved, import/no-extraneous-dependencies
const config = require('./../config');

/* Models */
const SensorHub = require('./../models/sensorhub');
const Data = require('./../models/data');

const router = express.Router();

function tempToColor (temp) {
  let degrees = 300 - ((temp + 50) / 100 * 300);

  while (degrees > 360) {
    degrees -= 360;
  }

  let output = [0, 0, 0];
  let value = 0;

  if (degrees <= 60) {
    value = parseInt(degrees / 60 * 255, 10);
    output = [255, value, 0];
  } else if (degrees <= 120) {
    value = 255 - parseInt(degrees / 120 * 255, 10);
    output = [value, 255, 0];
  } else if (degrees <= 180) {
    value = parseInt(degrees / 180 * 255, 10);
    output = [0, 255, value];
  } else if (degrees <= 240) {
    value = 255 - parseInt(degrees / 240 * 255, 10);
    output = [0, value, 255];
  } else if (degrees <= 300) {
    value = parseInt(degrees / 300 * 255, 10);
    output = [value, 0, 255];
  } else {
    value = 255 - parseInt(degrees / 120 * 255, 10);
    output = [255, 0, value];
  }

  return output;
}

function GetData (options) {
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

function tile2long (x, z) {
  return (x / Math.pow(2, z) * 360 - 180);
}

function tile2lat (y, z) {
  const n = Math.PI - 2 * Math.PI * y / Math.pow(2, z);
  return (180 / Math.PI * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n))));
}

router.get('/heatmap/:z/:x/:y', (req, res, next) => {
  SensorHub.find({}, (err, sensorHubs) => {
    if (err) {
      next(err);
      return;
    }

    const latitude = tile2lat(req.params.y, req.params.z);
    const longitude = tile2long(req.params.x, req.params.z);

    const calculatedHubs = [];
    for (var i = 0; i < sensorHubs.length; i += 1) {
      const sensorHub = sensorHubs[i];

      const from = {
        lat: parseFloat(sensorHub.Latitude, 10),
        lon: parseFloat(sensorHub.Longitude, 10)
      };

      const to = {
        lat: parseFloat(latitude, 10),
        lon: parseFloat(longitude, 10)
      };

      sensorHub.Distance = distance(from, to);
      calculatedHubs.push(sensorHub);
    }

    const selectedNodes = calculatedHubs.sort((a, b) => a.Distance - b.Distance).slice(0, 3);

    let divider = 0;
    for (var i = 0; i < selectedNodes.length; i += 1) {
      divider += (1 / parseFloat(selectedNodes[i].Distance, 10));
    }

    const promises = [];
    for (var i = 0; i < selectedNodes.length; i += 1) {
      promises.push(GetData({
        Type: 'temperature',
        SensorHub: selectedNodes[i].SerialID
      }));
    }

    Promise.all(promises)
      .then((data) => {
        let calculatedValue = 0;
        for (let i = 0; i < data.length; i += 1) {
          const dataNode = data[i];
          const sensorHub = selectedNodes[i];

          const weight = (1 / sensorHub.Distance) / divider;
          calculatedValue += (parseFloat(dataNode.Value, 10) * weight);
        }

        const image = new Jimp(256, 256, 0x0);
        const rgb = tempToColor(calculatedValue);

        for (let x = 0; x < 256; x += 1) {
          for (let y = 0; y < 256; y += 1) {
            image.setPixelColor(Jimp.rgbaToInt(rgb[0], rgb[1], rgb[2], parseFloat(0.25 * 255)), x, y);
          }
        }

        image.getBuffer(Jimp.MIME_PNG, (err, buffer) => {
          res.set('Content-Type', Jimp.MIME_PNG);
          res.send(buffer);
        });
      })
      .catch(err => res.send(err));
  });
});

router.get('/meetpunten', (req, res, next) => {
  SensorHub.find({}, (err, rawHubs) => {
    if (err) {
      next(err);
      return;
    }

    for (let i = 0; i < rawHubs.length; i += 1) {
      rawHubs[i].SerialID = rawHubs[i].SerialID.replace('\n', '');
    }

    res.render('meetpunten', {
      layout: false,
      sensorHubs: rawHubs
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
      url = `https://tiles.planet.com/basemaps/v1/planet-tiles/global_monthly_2018_02_mosaic/gmap/${req.params.z}/${req.params.x}/${req.params.y}.png?api_key=${config.Planet.Key}`;
      break;

    case 'mapbox':
      url = `https://a.tiles.mapbox.com/v3/planet.jh0b3oee/${req.params.z}/${req.params.x}/${req.params.y}.png`;
      break;

	//http://openweathermap.org/weathermap?basemap=map&layer=temperature&cities=false
	//https://www.npmjs.com/package/pngjs-image
	case 'heatmap':
	  var c = req.params;
	  var fileCachePath = path.join(__dirname, '../cache/heatmap/image-${c.x}-${c.y}-${c.z}.png');
	  url = fileCachePath;
	  break;

    default:
      res.sendFile(path.resolve(cachePath, '-1_-1_-1.jpg'));
      return;
  }

  base64.encode(url, {
    string: false
  }, (err, image) => {
    if (err) {
      next(err);
      return;
    }

    base64.decode(image, {
      filename: filePath.replace('.jpg', '')
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
