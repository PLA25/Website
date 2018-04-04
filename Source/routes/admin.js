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

router.use((req, res, next) => {
  if (res.locals.user.isAdmin) {
    next();
  } else {
    res.redirect('/login');
  }
});

router.use((req, res, next) => {
  if (req.isAdmin()) {
    res.locals.user = req.user;
  }

  next();
});

module.exports = router;
