/**
 * Middlewares
 *
 * @module middleware
 * @see module:middleware/isLoggedIn
 * @see module:middleware/isNotLoggedIn
 */

/* Middlewares */
const isLoggedIn = require('./isLoggedIn');
const isNotLoggedIn = require('./isNotLoggedIn');

module.exports = {
  isLoggedIn,
  isNotLoggedIn,
};
