const express = require('express');
const path = require('path');
const fs = require('fs');
const base64 = require('node-base64-image');
const pngjs = require('pngjs-image');

// eslint-disable-next-line import/no-unresolved, import/no-extraneous-dependencies
const config = require('./../config');

/* Models */
const SensorHub = require('./../models/sensorhub');

const router = express.Router();

//http://openweathermap.org/weathermap?basemap=map&cities=true&layer=temperature&lat=38.3417&lon=-85.3857&zoom=6
//https://www.npmjs.com/package/pngjs-image
router.get('/heatmap/:x/:y/:z', (req, res) => {
	var img = pngjs.createImage(300, 300);
	var transparentBlue = ({red: 50, green: 150, blue: 255, alpha: 100});
	img.fillRect(0, 0, 300, 300, transparentBlue);
	img.getImage();
	var c = req.params;
	var filePath = path.join(__dirname, '../cache/heatmap/image-' + c.x + '-' + c.y + '-' + c.z + '.png');
	img.writeImage(filePath, err => {
		if (err) {
			console.log('Couldn\'t cache image: ' + err);
			res.status(500);
			res.end();
		} else {
			res.sendFile(filePath);
		}
	});
});

router.get('/meetpunten', (req, res) => {
  SensorHub.find({}, (err, rawHubs) => {
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
