/**
 * Admin controller
 *
 * @module controllers/admin
 * @see module:controllers
 */

/* Packages */
const express = require('express');

/* Models */
const SensorHub = require('./../models/sensorhub');
const User = require('./../models/user');

/* Constants */
const router = express.Router();

/* Middlewares */
const {
  isAdmin,
} = require('./../middlewares');

/**
 * Renders the admin page.
 *
 * @name Admin
 * @path {GET} /admin
 */
router.get('/', isAdmin, (req, res, next) => {
  User.find({}).exec()
    .then(users => SensorHub.find({}).exec().then(sensorHubs => [users, sensorHubs]))
    .then(([users, sensorHubs]) => {
      res.render('admin', {
        users,
        sensorHubs,
      });
    })
    .catch((err) => {
      next(err);
    });
});

/* Exports */
module.exports = router;
