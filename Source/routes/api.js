var express = require('express');
var path = require('path');

var router = express.Router();

router.get('/meetpunten', (req, res) => {
  res.sendfile(path.join(__dirname, '../public', 'data.kml'));
});

router.get('*', (req, res) => {
  res.redirect('/map');
});

module.exports = router;
