/**
 * Controllers
 *
 * @module controllers
 * @see module:controllers/admin
 * @see module:controllers/api
 * @see module:controllers/home
 */

/* Packages */
const express = require('express');

/* Controllers */
const adminController = require('./admin.controller.js');
const apiController = require('./api.controller.js');
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
router.use('/admin', adminController);
router.use('/api', apiController);

router.use((req, res, next) => {
  if (!req.route) {
    res.redirect('/404');
  }

  next();
});

/* Exports */
module.exports = router;
