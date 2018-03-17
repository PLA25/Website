var express = require('express');
var router = express.Router();

/* GET map page. */
router.get('/', (req, res) => {
  res.render('map', {});
});

module.exports = router;
