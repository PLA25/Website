/**
 * Controllers
 *
 * @module controllers
 * @see controllers/home
 */

/* Packages */
const express = require('express');

/* Controllers */
const homeController = require('./home.controller.js');

/* Constants */
const has = Object.prototype.hasOwnProperty;
const router = express.Router();

router.use((req, res, next) => {
  if (!has.call(res.locals, 'user')) {
    if (req.isAuthenticated()) {
      res.locals.user = req.user;
    }
  }

  next();
});

router.use('/', homeController);

/* Exports */
module.exports = router;
