/**
 * Checks if the user is logged in;
 * If the user is logged in then the request continued;
 * If the user is not logged in then the user is redirect to the login page.
 *
 * @function
 * @see module:middleware
 * @module middleware/isLoggedIn
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {undefined}
 */
module.exports = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/login');
  }
};
