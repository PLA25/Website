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

router.get('*', (req, res) => {
  res.redirect('/map');
});

module.exports = router;
