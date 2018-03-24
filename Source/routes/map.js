const express = require('express');

const router = express.Router();

/* GET map page. */
router.get('/', (req, res) => {
  res.render('map', { title: 'Map' });
});

module.exports = router;
