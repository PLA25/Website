/**
 * Verifies if user has the role admin, if not redirect to 404.
 *
 * @function
 * @see module:middleware
 * @module middleware/isAdmin
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @return {undefined}
 */
module.exports = (req, res, next) => {
  if (req.user.isAdmin) {
    next();
  } else {
    res.redirect(404, '/404');
  }
};
