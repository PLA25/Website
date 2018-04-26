/**
 * Home controller
 *
 * @module controllers/home
 * @see module:controllers
 */

/* Packages */
const express = require('express');
const passport = require('passport');

/* Models */
const SensorHub = require('./../models/sensorhub');
const Data = require('./../models/data');
const User = require('./../models/user');

/* Constants */
const router = express.Router();

/* Middlewares */
const {
  isAdmin,
  isLoggedIn,
  isNotLoggedIn,
} = require('./../middlewares');

/**
 * Renders the index page.
 *
 * @name Index
 * @path {GET} /
 */
router.get('/', isLoggedIn, (req, res) => {
  res.render('index');
});

/**
 * Renders the admin page.
 *
 * @name Admin
 * @path {GET} /admin
 */
router.get('/admin', isAdmin, (req, res, next) => {
  User.find({}).exec()
    .then(users => SensorHub.find({}).exec().then(sensorHubs => [users, sensorHubs]))
    .then(([users, sensorHubs]) => {
      res.render('admin', {
        users,
        sensorHubs,
      });
    })
    .catch((err) => {
      next(err);
    });
});

/**
 * Renders a specific sensor page.
 *
 * @name Sensor
 * @path {GET} /sensor/:SerialID
 */
router.get('/sensor/:SerialID', isLoggedIn, (req, res, next) => {
  const today = new Date();
  const temp = new Date().setDate(today.getDate() - 500);
  const yesterday = new Date(temp);
  SensorHub.findOne({ SerialID: req.params.SerialID }).exec()
    .then(sensorHub => Data.find({
      SensorHub: req.params.SerialID,
      Timestamp: {
        $gte: yesterday,
        $lt: today,
      },
    }).exec()
      .then((data) => {
        const sensorHubData = [];
        const dateOptions = {
          year: '2-digit',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        };
        for (let i = 0; i < data.length; i += 1) {
          const objData = data[i].toObject();
          objData.formatDate = data[i].Timestamp.toLocaleString(dateOptions);

          sensorHubData.push(objData);
        }
        return sensorHubData;
      }).then(sensorHubData => [sensorHub, sensorHubData]))
    .then(([sensorHub, sensorHubData]) => {
      res.render('sensor', {
        sensorHub,
        sensorHubData,
      });
    })
    .catch((err) => {
      next(err);
    });
});

/**
 * Renders the login page.
 *
 * @name Login
 * @path {GET} /login
 */
router.get('/login', isNotLoggedIn, (req, res) => {
  res.render('login', {
    title: 'Login',
    layout: 'layout-nonav',
    error: req.flash('error'),
  });
});

/**
 * Changes the language of the interface.
 *
 * @name Locale
 * @path {GET} /locale-:locale
 */
router.get('/locale-:locale', (req, res) => {
  req.session.locale = req.params.locale;
  res.redirect('back');
});

/**
 * Handles all post-data for login.
 *
 * @name Login
 * @path {POST} /login
 */
router.post('/login', isNotLoggedIn, passport.authenticate('local-login', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true,
}));

/**
 * Log the user out of the system.
 *
 * @name Logout
 * @path {GET} /logout
 */
router.get('/logout', isLoggedIn, (req, res) => {
  req.logout();
  res.redirect('/login');
});

/**
 * Renders the map page.
 *
 * @name Map
 * @path {GET} /map
 */
router.get('/map', isLoggedIn, (req, res) => {
  res.render('map');
});

/* Exports */
module.exports = router;
