/**
 * Sets the authenticated user object in the locals.
 *
 * @function
 * @see module:middleware
 * @module middleware/setUser
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @return {undefined}
 */
module.exports = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.locals.user = req.user;
  }

  next();
};
