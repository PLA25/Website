/**
 * Throws the 404 error and renders its page.
 *
 * @function
 * @see module:middleware
 * @module middleware/pageNotFoundHandler
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @return {undefined}
 */
module.exports = (req, res) => {
  res.status(404);
  res.render('404');
};
