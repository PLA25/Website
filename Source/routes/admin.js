/** Requires the Express module for routing, and the User and SensorHub models for admin management. */
const express = require('express');
const User = require('./../models/user');
const SensorHub = require('./../models/sensorhub');

/** Creates router instance for this route. */
const router = express.Router();

/** Checks if the user is an admin. */
router.use((req, res, next) => {
  /** If the user is an admin, continue to the admin page. */
  if (req.user.isAdmin) {
    next();
  /**
   * If the user is not an admin, redirect to the home page.
   * @todo Redirect to the 404 page instead to hide the location of the admin page.
   */
  } else {
    res.redirect('/');
  }
});

/** Displays the admin page content. */
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
