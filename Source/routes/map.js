/**
 * Map route
 *
 * @module routes/map
 * @see module:routes
 */

/* Packages */
const express = require('express');

/* Constants */
const router = express.Router();

/**
 * Renders the map page.
 *
 * @name Index
 * @path {GET} /map/
 * @code {200} if the request is sucesfull
 */
router.get('/', (req, res) => {
  res.render('map');
});

module.exports = router;
