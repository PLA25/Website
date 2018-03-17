var sensorHub = require('./../models/sensorhub');
var express = require('express');
var path = require('path');

var router = express.Router();

router.get('/meetpunten', (req, res) => {
  sensorHub.find({}, function(err, rawHubs) {
    for (var i = 0; i < rawHubs.length; i++) {
      rawHubs[i].SerialID = rawHubs[i].SerialID.replace('\\n', '');
    }

    res.render('meetpunten', {
      layout: false,
      sensorHubs: rawHubs
    });
  });
});

router.get('*', (req, res) => {
  res.redirect('/map');
});

module.exports = router;
