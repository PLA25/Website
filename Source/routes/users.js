const app = require('express').Router();

app.get('/', function(req, res) {
	res.send('iets');
});

module.exports = app;