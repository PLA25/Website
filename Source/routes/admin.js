const app = require('express').Router();

const check = function(req, res, next) {
	if ('user' in req) {
		next();
	} else {
		res.redirect('/login');
	}
};

app.get("/admin", check, function(req, res) {
	if (req.user.role == 'admin') {
		//res.sendFile("./admin.html", root);
		res.render('admin');
	} else {
		res.redirect('/map');
	}
});

module.exports = app;