/**
 * Middlewares
 *
 * @module middleware
 * @see module:middleware/isAdmin
 * @see module:middleware/isLoggedIn
 * @see module:middleware/isNotLoggedIn
 */

/* Middlewares */
const isAdmin = require('./isAdmin');
const isLoggedIn = require('./isLoggedIn');
const isNotLoggedIn = require('./isNotLoggedIn');

module.exports = {
  isAdmin,
  isLoggedIn,
  isNotLoggedIn,
};
