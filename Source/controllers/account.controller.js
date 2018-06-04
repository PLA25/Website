/**
 * Account controller
 *
 * @module controllers/account
 * @see module:controllers
 */

/* Packages */
const express = require('express');
const User = require('./../models/user');

/* Constants */
const router = express.Router();

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
  if ((b.old_pass && b.new_pass && b.repeat_pass) && b.new_pass === b.repeat_pass) {
    User.findOne({ email: req.user.email }).exec().then((user) => {
      // user.password = bcrypt.hashSync(new_pass, 16);
      if (user.validatePassword(b.old_pass)) {
        /*
         * bewerkingen
         * user.save();
         */
        res.redirect('/logout');
      } else {
        res.redirect('/account/edit?fail=true');
      }
    });
  } else if (b.new_name) {
    // later
  } else {
    res.redirect('/account/edit');
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
