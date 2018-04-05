const express = require('express');

const config = require('../config');

const router = express.Router();

/* GET map page. */
router.get('/', (req, res) => {
  res.render('map', config);
});

module.exports = router;
