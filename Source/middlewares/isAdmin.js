/* Constants */
const has = Object.prototype.hasOwnProperty;

/**
 * Checks if the user has the admin role;
 * If the user is an admin then the request is continued;
 * If the user is not an admin then he is redirect to the 404-page.
 *
 * @function
 * @see module:middleware
 * @module middleware/isAdmin
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {undefined}
 */
module.exports = (req, res, next) => {
  if (!has.call(res.locals, 'user')) {
    res.redirect('/login');
    return;
  }

  if (req.user.isAdmin) {
    next();
  } else {
    res.status(404);
    res.render('404');
  }
};
