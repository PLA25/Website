/**
 * middleware
 * @module middleware
 * @see module:middleware/errorHandler
 * @see module:middleware/isAdmin
 * @see module:middleware/isLoggedIn
 * @see module:middleware/setUser
 * @see module:middleware/pageNotFoundHandler
 */

const errorHandler = require('./errorHandler');
const isAdmin = require('./isAdmin');
const isLoggedIn = require('./isLoggedIn');
const setUser = require('./setUser');
const pageNotFoundHandler = require('./pageNotFoundHandler');

module.exports = {
  errorHandler, isAdmin, isLoggedIn, setUser, pageNotFoundHandler,
};
