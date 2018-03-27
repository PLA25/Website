const express = require('express');
const User = require('./../models/user');
const router = express.Router();

router.get('/', (req, res) => {
  User.find({}, (err, users) => {
    res.render('admin', {
      Users: users,
    });
  });
});

module.exports = router;
