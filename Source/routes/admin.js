const express = require('express');
const User = require('./../models/user');
const SensorHub = require('./../models/sensorhub');

const router = express.Router();

router.use((req, res, next) => {
  if (req.user.isAdmin) {
    next();
  } else {
    res.redirect('/');
  }
});

router.get('/', (req, res, next) => {
  User.find({}, (err, users) => {
    if (err) {
      next(err);
      return;
    }
    SensorHub.find({}, (err, rawHubs) => {
      if (err) {
        next(err);
        return;
      }

      res.render('admin', {
        Users: users,
        sensorHubs: rawHubs,
      });
    });
  });
});

module.exports = router;
