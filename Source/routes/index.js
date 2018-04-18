/**
 * Routes
 *
 * @module routes
 * @see module:routes/admin
 * @see module:routes/api
 * @see module:routes/home
 * @see module:routes/map
 */

/* Packages */
const express = require('express');

/* Constants */
const router = express.Router();

/* Middleware */
const {
  errorHandler,
  isLoggedIn,
  setUser,
  pageNotFoundHandler,
} = require('./../middleware');

/* Routes */
const home = require('./home');
const admin = require('./admin');
const api = require('./api');
const map = require('./map');

router.use(setUser);

router.use('/', home);

/* Only allow authenticated user */
router.use(isLoggedIn);

/* Sets addresses for each page instance. */
router.use('/admin', admin);
router.use('/api', api);
router.use('/map', map);

/* Handlers */
router.use(pageNotFoundHandler);
router.use(errorHandler);

module.exports = router;
