var express = require('express');
var router = express.Router();

/* GET logout page */
router.get('/', (req, res) => {
	req.logout();
	res.redirect('/');
});

module.exports = router;