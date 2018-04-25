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

/**
 * Uploads a logo.
 *
 * @name Upload logo
 * @path {POST} /upload-logo
 */
router.post('/upload-logo', (req, res) => {
  if (!req.files) {
    return res.status(400).send('No files were uploaded.');
  }

  /* The name of the input field is used to retrieve the uploaded file. */
  const { logo } = req.files;

  /* Uses the mv() method to save this file. */
  logo.mv(`${__dirname}/public/logo.png`, (err) => {
    if (err) {
      return res.status(500).send(err);
    }

    res.redirect('/admin');

    return false;
  });

  return false;
});

/* Exports */
module.exports = router;
