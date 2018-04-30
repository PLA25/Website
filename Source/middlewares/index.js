/**
 * Middlewares
 *
 * @module middleware
 * @see module:middleware/isAdmin
 * @see module:middleware/isLoggedIn
 * @see module:middleware/isNotLoggedIn
 * @see module:middleware/pageNotFound
 */

/* Middlewares */
const isAdmin = require('./isAdmin');
const isLoggedIn = require('./isLoggedIn');
const isNotLoggedIn = require('./isNotLoggedIn');
const pageNotFound = require('./pageNotFound');

module.exports = {
  isAdmin,
  isLoggedIn,
  isNotLoggedIn,
  pageNotFound,
};
