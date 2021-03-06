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
const accountController = require('./account.controller.js');
const adminController = require('./admin.controller.js');
const apiController = require('./api.controller.js');
const homeController = require('./home.controller.js');

/* Constants */
const has = Object.prototype.hasOwnProperty;
const router = express.Router();

/* Middlewares */
const {
  pageNotFound,
} = require('./../middlewares');

router.use((req, res, next) => {
  if (!has.call(res.locals, 'user')) {
    if (req.isAuthenticated()) {
      res.locals.user = req.user;
    }
  }

  next();
});

/* Routes */
router.use('/', homeController);
router.use('/account', accountController);
router.use('/admin', adminController);
router.use('/api', apiController);

/* Error Handling */
router.use(pageNotFound);

/* Exports */
module.exports = router;
