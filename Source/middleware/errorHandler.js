/**
 * Catches and handles all unhandled errors.
 *
 * @function
 * @see module:middleware
 * @module middleware/errorHandler
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @return {undefined}
 */
module.exports = (err, req, res) => {
  /* Sets locals, only providing error in development. */
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  /*
   * Sets the appropriate error status, if it doesn't exist then set it as the 500 error, which
   * is known for unspecificity.
   */
  res.status(err.status || 500);

  /* Renders the error page from its view. */
  res.render('error');
};
