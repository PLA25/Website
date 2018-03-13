const app = require('express').Router();
const check = function(req, res, next) {
	if ('user' in req) {
		next();
	} else {
		res.redirect('/login');
	}
};

app.get("/map", check, function(req, res) {
	//res.sendFile("./map.html", root);
	res.render('map');
});

module.exports = app;