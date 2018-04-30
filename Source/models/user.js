/* Packages */
const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const schema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
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
   * Validates a password.
   * @param {String} password - The password value.
   * @returns {Boolean} If the given password matches.
   */
  validatePassword(password) {
    return bcrypt.compareSync(password, this.password);
  }
}

schema.loadClass(User);
module.exports = mongoose.model('User', schema);
