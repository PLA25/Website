/**
 * Account controller
 *
 * @module controllers/account
 * @see module:controllers
 */

/* Packages */
const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const User = require('./../models/user');

/* Constants */
const router = express.Router();
const salt = bcrypt.genSaltSync(8);

/* Middlewares */
const {
  isLoggedIn,
} = require('./../middlewares');

router.use(isLoggedIn);

/**
 * Renders the profile page.
 *
 * @name Profile
 * @path {GET} /account
 */
router.get('/', (req, res) => {
  res.render('profile', {
    title: 'Profile Page',
  });
});

/**
 * Saves the changes to an account
 *
 * @name Profile
 * @path {POST} /account/edit
 */
router.post('/edit', (req, res) => {
  const b = req.body;
  if (b.passChange) {
    if ((!!b.old_pass && !!b.new_pass && !!b.repeat_pass) && b.new_pass === b.repeat_pass) {
      User.findOne({ email: req.user.email }).exec().then((user) => {
        if (user.validatePassword(b.old_pass)) {
          user.password = bcrypt.hashSync(b.new_pass, salt);
          user.save();
          res.redirect('/logout');
        } else {
          res.redirect('/account/edit?fail=true');
        }
      });
    } else {
      res.redirect('/account/edit?fail=true');
    }
  } else if (b.nameChange) {
    if (b.name) {
      User.findOne({ email: req.user.email }).exec().then((user) => {
        user.name = b.name;
        user.save();
        res.redirect('/account');
      });
    } else {
      res.redirect('/account/edit?fail=true');
    }
  }
});

/**
 * The account edit page
 *
 * @name Profile
 * @path {GET} /account/edit
 */
router.get('/edit', (req, res) => {
  res.render('editProfile', {
    title: 'Edit Account',
    layout: 'layout-nonav',
    fail: (req.query.fail === 'true'),
  });
});

/* Exports */
module.exports = router;
