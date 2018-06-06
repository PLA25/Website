/**
 * Home controller
 *
 * @module controllers/home
 * @see module:controllers
 */

/* Packages */
const express = require('express');
const i18n = require('i18n');
const fs = require('fs');

/* Constants */
const router = express.Router();

/**
 * Renders the index page.
 *
 * @name Index
 * @path {GET} /
 */
router.get('/', (req, res) => {
  res.render('indexfts');
});

/**
 * Saves the changes to an sensorhub
 *
 * @name Profile
 * @path {POST} /editsensor/:SerialID
 */
router.post('/fts', (req) => {
  const {
    MongoDBHost,
    MongoDBPort,
    MongoDBUser,
    MongoDBPass,
    MongoDBName,
    PlanetKey,
    Redishost,
    Redisport,
    Redispass,
    Redisdb,
  } = req.body;

  const configdata = `${'module.exports = {\n' +
             '  MongoDB: {\n' +
             '    Host: "'}${
    MongoDBHost
  }",\n` +
             `    Port: ${
               MongoDBPort
             },\n` +
             `    User: "${
               MongoDBUser
             }",\n` +
             `    Pass: "${
               MongoDBPass
             }",\n` +
             `    Name: "${
               MongoDBName
             }",\n` +
             '  },\n' +
             '  Planet: {\n' +
             `    Key: "${
               PlanetKey
             }",\n` +
             '  },\n' +
             '  Redis: {\n' +
             `    host: "${
               Redishost
             }",\n` +
             `    port: ${
               Redisport
             },\n` +
             `    pass: "${
               Redispass
             }",\n` +
             `    db: ${
               Redisdb
             },\n` +
             '  },\n' +
             '};';

    // write to a new file named config.js
  fs.writeFile('config.js', configdata, (err) => {
    // throws an error, you could also catch it here
    if (err) throw err;
  });
});

/**
 * Changes the language of the interface.
 *
 * @name Locale
 * @path {GET} /locale-:locale
 */
router.get('/locale-:locale', (req, res) => {
  i18n.setLocale(req.params.locale);
  res.redirect('back');
});

/* Exports */
module.exports = router;
