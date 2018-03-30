const express = require('express');
const User = require('./../models/user');
const SensorHub = require('./../models/sensorhub');

const router = express.Router();

router.get('/', (req, res) => {
  User.find({}, (err, users) => {
    SensorHub.find({}, (err, rawHubs) => {
      res.render('admin', {
        Users: users,
        sensorHubs: rawHubs,
      });
    });
  });
});

module.exports = router;
