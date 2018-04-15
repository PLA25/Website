/**
 * Admin route
 *
 * @module routes/admin
 * @see module:routes
 */

/* Packages */
const express = require('express');

/* Middleware */
const isAdmin = require('./../middleware/isAdmin');

/* Models */
const User = require('./../models/user');
const SensorHub = require('./../models/sensorhub');

/* Constants */
const router = express.Router();

router.all('*', isAdmin);

/**
 * Renders the admin index page.
 *
 * @name Admin index
 * @path {GET} /admin/
 * @code {200} if the request is sucesfull
 * @code {500} if the request fail because the database isn't accesible
 */
router.get('/', (req, res, next) => {
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

module.exports = router;
