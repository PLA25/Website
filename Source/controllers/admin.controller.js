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
 * @path {POST} /admin/upload-logo
 */
router.post('/upload-logo', isAdmin, (req, res) => {
  if (!req.files) {
    res.status(400).send('No files were uploaded.');
  }

  /* The name of the input field is used to retrieve the uploaded file. */
  const { logo } = req.files;

  /* Checks if image is a PNG file. */
  if (logo.mimetype !== 'image/png') {
    res.redirect('/admin');

    return;
  }

  /* Uses the mv() method to save this file. */
  logo.mv('./public/logo.png', (err) => {
    if (err) {
      res.status(500).send(err);
    }

    res.redirect('/admin');
  });
});

/* Exports */
module.exports = router;
