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
const homeController = require('./home.controller.js');

/* Constants */
const router = express.Router();

/* Middlewares */
const {
  pageNotFound,
} = require('./../middlewares');

/* Routes */
router.use('/', homeController);

/* Error Handling */
router.use(pageNotFound);

/* Exports */
module.exports = router;
