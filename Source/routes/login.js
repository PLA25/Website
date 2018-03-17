var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();

var user = ({username: "koen", password: "123"});

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));

/* GET login page. */
router.get('/', (req, res) => {
	res.render('login', {title: "Login"});
});

router.post('/', (req, res) => {
	if (req.body.username == user.username && req.body.password == user.password) {
		//weet niet wat de hoofdpagina is
		res.redirect('/hoofdpagina');
	} else {
		res.render('login', {title: "Login"});
	}
});

module.exports = router;
