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
