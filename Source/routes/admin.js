/**
 * Admin route
 *
 * @module routes/admin
 * @see module:routes
 */

const express = require('express');
const User = require('./../models/user');
const SensorHub = require('./../models/sensorhub');

const router = express.Router();

/**
 * Description of my middleware.
 *
 * @module myMiddleware
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
router.use((req, res, next) => {
  if (req.user.isAdmin) {
    next();
  } else {
    res.redirect('/');
  }
});

/**
 * Admin page
 *
 * @name Admin index
 * @path {GET} /admin
 */
router.get('/', (req, res, next) => {
  User.find({}).exec()
    .then(users => SensorHub.find({}).exec().then(sensorHubs => [users, sensorHubs]))
    .then(([users, sensorHubs]) => {
      /** Renders the view 'admin' with User and SensorHub data. */
      res.render('admin', {
        users,
        sensorHubs,
      });
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
