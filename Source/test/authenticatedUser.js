/* Packages */
const chai = require('chai');
const request = require('supertest');
const app = require('./../bin/www');

chai.should();

const userCredentials = {
  email: 'admin',
  password: 'admin',
};

const authenticatedUser = request.agent(app);
before((done) => {
  authenticatedUser
    .post('/login')
    .send(userCredentials)
    .end((err, res) => {
      res.statusCode.should.equal(302);
      res.headers.location.should.equal('/');
      done();
    });
});

module.exports = authenticatedUser;
