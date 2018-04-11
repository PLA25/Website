/**
 * Check if the user is logged in.
 *
 * @function
 * @see module:middleware
 * @module middleware/isLoggedIn
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @return {undefined}
 */
module.exports = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/login');
  }
};
