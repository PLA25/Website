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

/**
 * Renders the profile page.
 *
 * @name Profile
 * @path {GET} /account
 */
router.get('/', isLoggedIn, (req, res) => {
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
router.post('/edit', isLoggedIn, (req, res, next) => {
	const {
		passChange,
		oldPass,
		newPass,
		repeatPass,
		nameChange,
		name,
	} = req.body;
	User.findOne({
		email: req.user.email
	}).exec().then((user) => {
		if (!user) {
			next(new Error(`Could not find user with email: '${req.user.email}'!`));
			return;
		}
		if (passChange && (!!oldPass && !!newPass && !!repeatPass) && newPass === repeatPass) {
			if (user.validatePassword(oldPass)) {
				// eslint-disable-next-line no-param-reassign
				user.password = bcrypt.hashSync(newPass, salt);
				user.save();
				res.redirect('/logout');
			} else {
				res.redirect('/account/edit?fail=true');
			}
		} else if (nameChange) {
			// eslint-disable-next-line no-param-reassign
			user.name = name;
			user.save();
			res.redirect('/account');
		} else {
			res.redirect('/account/edit?fail=true');
		}
	}).catch((err) => {
		next(err);
	});
});

/**
 * The account edit page
 *
 * @name Profile
 * @path {GET} /account/edit
 */
router.get('/edit', isLoggedIn, (req, res) => {
	res.render('editProfile', {
		title: 'Edit Account',
		fail: (req.query.fail === 'true'),
	});
});

/* Exports */
module.exports = router;
