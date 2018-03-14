const app = require('express').Router();

const passport = require('passport');

const check = require('./check');

app.get("/admin", check, function(req, res) {
	if (req.user.role == 'admin') {
		//res.sendFile("./admin.html", root);
		res.render('admin');
	} else {
		res.redirect('/map');
	}
});

app.post("/", passport.authenticate('local', {}), (req, res) => {
	if (req.isAuthenticated()) {
		res.redirect('/map');
	} else {
		res.redirect('/login');
	}
});

app.get("/login", function(req, res) {
	if (!req.isAuthenticated()) {
		res.render('login');
	} else {
		res.redirect('/map');
	}
});

app.get("/map", check, function(req, res) {
	//res.sendFile("./map.html", root);
	res.render('map');
});

module.exports = app;