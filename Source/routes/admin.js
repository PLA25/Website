const express = require('express');
const User = require('./../models/user');
const SensorHub = require('./../models/sensorhub');
const router = express.Router();

router.get('/', (req, res) => {
  User.find({}, (err, users) => {
    res.render('admin', {
      Users: users,
    });
  });
});

router.get('/meetpunten', (req, res) => {
  SensorHub.find({}, (err, rawHubs) => {
    res.render('meetpunten', {
      layout: false,
      sensorHubs: rawHubs,
    });
  });
});

module.exports = router;
