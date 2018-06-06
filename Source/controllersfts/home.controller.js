/**
 * Home controller
 *
 * @module controllers/home
 * @see module:controllers
 */

/* Packages */
const express = require('express');
const i18n = require('i18n');

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
