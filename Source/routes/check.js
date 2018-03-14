const check = function(req, res, next) {
	if ('user' in req) {
		next();
	} else {
		res.redirect('/login');
	}
};

module.exports = check;