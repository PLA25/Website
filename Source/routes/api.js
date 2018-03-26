const sensorHub = require('./../models/sensorhub');
const express = require('express');

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

router.get('/:z/:x/:y', (req, res) => {
  res.redirect(`https://tiles.planet.com/basemaps/v1/planet-tiles/global_monthly_2018_02_mosaic/gmap/${req.params.z}/${req.params.x}/${req.params.y}.png?api_key=44db310cea0743da8e73888c2d2d7b3f`);
});

router.get('*', (req, res) => {
  res.redirect('/map');
});

module.exports = router;
