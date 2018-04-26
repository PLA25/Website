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
 * @code {200} if the request is successful
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
 * @code {200} if a PNG file is uploaded successfully
 * @code {400} if no files or the wrong file type is uploaded
 */
router.post('/upload-logo', isAdmin, (req, res) => {
  if (!req.files) {
    res.status(400).send('No files were uploaded.');
    return;
  }

  /* The name of the input field is used to retrieve the uploaded file. */
  const {
    logo,
  } = req.files;

  /* Checks if image is a PNG file. */
  if (logo.mimetype !== 'image/png') {
    res.redirect(400, '/admin');
    return;
  }

  /* Uses the mv() method to save this file. */
  logo.mv('./public/logo.png', (err) => {
    if (err) {
      res.status(500).send(err);
      return;
    }

    res.redirect(200, '/admin');
  });
});

/* Exports */
module.exports = router;
