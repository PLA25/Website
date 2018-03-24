const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

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
	  type: boolean,
  },
});

function getUsers() {
	//haal de gebruikers uit de db, geeft nu dummy data
	return [
		{email: "test123@gmail.com", password: "test", isAdmin: "true", un: "sjaak", pw: "123"},
		{email: "role@gmail.com", password: "role", isAdmin: "false", un: "kees", pw: "123"}
	];
}

userSchema.methods.generateHash = function generateHash(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function validatePassword(password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
