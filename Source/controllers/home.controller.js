/**
 * Home controller
 *
 * @module controllers/home
 * @see module:controllers
 */

/* Packages */
const express = require('express');
const i18n = require('i18n');
const passport = require('passport');

/* Constants */
const router = express.Router();

/* Middlewares */
const {
  isLoggedIn,
  isNotLoggedIn,
} = require('./../middlewares');

/* Models */
const Data = require('./../models/data');
const SensorHub = require('./../models/sensorhub');
const Setting = require('./../models/setting');

/**
 * Renders the index page.
 *
 * @name Index
 * @path {GET} /
 */
router.get('/', isLoggedIn, (req, res) => {
  res.render('index');
});

// eslint-disable-next-line no-extend-native, func-names
Date.prototype.format = function () {
  const mm = this.getMonth() + 1;
  const dd = this.getDate();
  const hour = this.getHours();
  const min = this.getMinutes();

  return [this.getFullYear(),
    (mm > 9 ? '' : '0') + mm,
    (dd > 9 ? '' : '0') + dd,
    `${(hour > 9 ? '' : '0') + hour}:${
      min > 9 ? '' : '0'}${min}`,
  ].join(' - ');
};

/**
 * Renders a specific sensorhub page.
 *
 * @name Sensorhub
 * @path {GET} /sensorhub/:SerialID
 * @params {String} :SerialID is the SerialID of the SensorHub.
 */
router.get('/sensorhub/:SerialID', isLoggedIn, (req, res, next) => {
  SensorHub.findOne({
    SerialID: req.params.SerialID,
  }).exec()
    .then((sensorHub) => {
      if (sensorHub === null) {
        next(new Error(`Could not find SensorHub with ID: '${req.params.SerialID}'!`));
        return;
      }

      // eslint-disable-next-line consistent-return
      return Data.find({
        Type: 'temperature',
        SensorHub: sensorHub.SerialID,
      })
        .sort({ Timestamp: -1 })
        .exec()
        .then(temperatureData => [sensorHub, temperatureData]);
    })
    .then(([sensorHub, temperatureData]) => Data.find({
      Type: 'light',
      SensorHub: sensorHub.SerialID,
    }).exec()
      .then(lightData => [sensorHub, temperatureData, lightData]))
    .then(([sensorHub, temperatureData, lightData]) => Data.find({
      Type: 'gasses',
      SensorHub: sensorHub.SerialID,
    }).exec()
      .then(gassesData => [sensorHub, temperatureData, lightData, gassesData]))
    .then(([sensorHub, temperatureData, lightData, gassesData]) => {
      temperatureData.forEach((tempData) => {
        // eslint-disable-next-line no-param-reassign
        tempData.locale = new Date(tempData.Timestamp).format();
      });

      lightData.forEach((tempData) => {
        // eslint-disable-next-line no-param-reassign
        tempData.locale = new Date(tempData.Timestamp).format();
      });

      gassesData.forEach((tempData) => {
        // eslint-disable-next-line no-param-reassign
        tempData.locale = new Date(tempData.Timestamp).format();
      });

      res.render('sensorhub', {
        sensorHub,
        temperatureData,
        lightData,
        gassesData,
      });
    })
    .catch((err) => {
      next(err);
    });
});

/**
 * Renders a specific setting page.
 *
 * @name setting
 * @path {GET} /setting/:valueID
 * @params {String} :valueID is the SerialID of the limit.
 */
router.get('/setting/:valueID', isLoggedIn, (req, res, next) => {
  Setting.findOne({
    valueID: req.params.valueID,
  }).exec()
    .then((valueID) => {
      if (valueID === null) {
        next(new Error(`Could not find setting with ID: '${req.params.valueID}'!`));
        return;
      }
      res.render('setting', {
        valueID,
      });
    })
    .catch((err) => {
      next(err);
    });
});

/**
 * Handles all post-data for setting.
 *
 * @name setting
 * @path {POST} /login/:valueID
 */
router.post('/setting/:valueID', isLoggedIn, (req) => {
  Setting.updateOne({
    valueID: req.params.valueID,
    value: req.query.NewValue,
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
  i18n.setLocale(req.params.locale);
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
