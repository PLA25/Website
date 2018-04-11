/* Packages */
const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const schema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
  },
});

/**
 * Class representing a user.
 * @class
 */
class User {
  /**
   * Creates a new user.
   * @param {string} username - The username value.
   * @param {string} password - The password value.
   */
  constructor(username, password) {
    this.email = username;
    this.password = User.encryptPassword(password);
  }

  /**
   * Encrypts the given password.
   * @param {string} password - The password value.
   * @return {string} An encrypted password.
   */
  static encryptPassword(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  }

  /**
   * Validates a password.
   * @param {string} password - The password value.
   * @return {boolean} If the given password matches.
   */
  validatePassword(password) {
    return bcrypt.compareSync(password, this.password);
  }
}

schema.loadClass(User);
module.exports = mongoose.model('User', schema);
