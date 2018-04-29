/**
 * Is called upon if a page could not be found;
 * Renders the error 404 page.
 *
 * @function
 * @see module:middleware
 * @module middleware/pageNotFound
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {undefined}
 */
module.exports = (req, res) => {
  res.status(404);
  res.render('404');
};
