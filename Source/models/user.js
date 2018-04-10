/** Requires the Mongoose module for database schemas and the bcrypt module for encryption. */
const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

/** Creates the User schema with attributes reflecting the ones in the database. */
const userSchema = new mongoose.Schema({
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
 * Creates an encrypted version of the password.
 * @param {string} password - The password of the user.
 */
userSchema.methods.generateHash = function generateHash(password) {
  /** Encrypts the password with 8 rounds. */
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

/**
 * Compares the entered password with the password of the user in the database.
 * @param {string} password - The password of the user.
 */
userSchema.methods.validPassword = function validatePassword(password) {
  /** Compares while keeping the encryption in mind. */
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
