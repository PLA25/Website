/**
 * Admin controller
 *
 * @module controllers/admin
 * @see module:controllers
 */

/* Packages */
const express = require('express');
const weekNumber = require('current-week-number');
const {
  spawn,
} = require('child_process');

/* Models */
const Data = require('./../models/data');
const SensorHub = require('./../models/sensorhub');
const User = require('./../models/user');
const Config = require('./../models/config');

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
    .then(users => SensorHub.find({}).exec()
      .then(sensorHubs => [users, sensorHubs]))
    .then(([users, sensorHubs]) => Config.find({}).exec()
      .then(configs => [users, sensorHubs, configs]))
    .then(([users, sensorHubs, configs]) => {
      res.render('admin', {
        users,
        sensorHubs,
        configs,
      });
    })
    .catch((err) => {
      next(err);
    });
});

/**
 * Flips the inMargin field of a data-object.
 *
 * @name Flip
 * @path {GET} /admin
 * @params {String} :id mongodb _id of the object to flip.
 * @code {302} if the request is successful
 * @code {500} if the request is failed
 */
router.get('/flip/:id', isAdmin, (req, res, next) => {
  Data.findOne({
    _id: req.params.id,
  }).exec()
    .then((data) => {
      if (data == null) {
        next(new Error('Not found'));
        return;
      }

      const date = new Date(data.Timestamp);

      let type = 0;
      if (data.Type === 'temperature') {
        type = 0;
      } else if (data.Type === 'gasses') {
        type = 1;
      } else {
        type = 2;
      }

      let {
        inMargin,
      } = data;
      if (inMargin === 0) {
        inMargin = 1;
      } else {
        inMargin = 0;
      }

      const py = spawn('python', ['ml.py']);
      const pyData = [
        date.getDay() - 1,
        weekNumber(date),
        date.getUTCHours(),
        type,
        parseInt(data.Value, 10),
        inMargin,
      ];

      let dataString = '';
      py.stdout.on('data', (output) => {
        dataString += output.toString();
      });

      py.stdout.on('end', () => {
        const output = JSON.parse(dataString)[0];
        // eslint-disable-next-line no-param-reassign
        data.inMargin = output;
        data.save()
          .then(() => {
            res.redirect('back');
          })
          .catch((err) => {
            next(err);
          });
      });

      py.stdin.write(JSON.stringify(pyData));
      py.stdin.end();
    })
    .catch((err) => {
      next(err);
    });
});

/**
 * Renders a specific sensorhub edit page.
 *
 * @name editsensor
 * @path {GET} /editsensor/:SerialID
 * @params {String} :SerialID is the SerialID of the limit.
 */
router.get('/editsensor/:SerialID', isAdmin, (req, res, next) => {
  SensorHub.findOne({
    SerialID: req.params.SerialID,
  }).exec()
    .then((SerialID) => {
      if (SerialID === null) {
        next(new Error(`Could not find sensorhub with ID: '${req.params.SerialID}'!`));
        return;
      }
      res.render('editsensor', {
        SerialID,
      });
    })
    .catch((err) => {
      next(err);
    });
});

/**
 * Saves the changes to an sensorhub
 *
 * @name Profile
 * @path {POST} /editsensor/:SerialID
 */
router.post('/editsensor/:SerialID', isAdmin, (req, res, next) => {
  const {
    Latitude,
    Longitude,
  } = req.body;

  SensorHub.findOne({
    SerialID: req.params.SerialID,
  }).exec()
    .then((sensorHub) => {
      if (!sensorHub) {
        next(new Error(`Could not find sensorhub with ID: '${req.params.SerialID}'!`));
        return;
      }

      if (Latitude) {
        // eslint-disable-next-line no-param-reassign
        sensorHub.Latitude = Latitude;
      }

      if (Longitude) {
        // eslint-disable-next-line no-param-reassign
        sensorHub.Longitude = Longitude;
      }

      sensorHub.save();

      res.redirect('/admin');
    })
    .catch((err) => {
      next(err);
    });
});

/**
 * Renders a specific config page.
 *
 * @name config
 * @path {GET} /config/:valueID
 * @params {String} :valueID is the SerialID of the config.
 */
router.get('/config/:valueID', isAdmin, (req, res, next) => {
  Config.findOne({
    valueID: req.params.valueID,
  }).exec()
    .then((valueID) => {
      if (valueID === null) {
        next(new Error(`Could not find config with ID: '${req.params.valueID}'!`));
        return;
      }
      res.render('config', {
        valueID,
      });
    })
    .catch((err) => {
      next(err);
    });
});

/**
 * Saves the changes to an config
 *
 * @name Profile
 * @path {POST} /config/:valueID
 */
router.post('/config/:valueID', isAdmin, (req, res, next) => {
  const {
    value,
  } = req.body;

  if (!value) {
    res.redirect('/admin');
    return;
  }

  Config.findOne({
    valueID: req.params.valueID,
  }).exec()
    .then((config) => {
      if (!config) {
        next(new Error(`Could not find config with ID: '${req.params.valueID}'!`));
        return;
      }

      // eslint-disable-next-line no-param-reassign
      config.value = value;
      config.save();

      res.redirect('/admin');
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
router.post('/upload-logo', isAdmin, (req, res, next) => {
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
      next(err);
    } else {
      res.redirect(200, '/admin');
    }
  });
});

/* Exports */
module.exports = router;
