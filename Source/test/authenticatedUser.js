/* Environment */
process.env.NODE_ENV = 'testing';

/* Packages */
const chai = require('chai');
const request = require('supertest');
const app = require('./../bin/www');

chai.should();

const adminCredentials = {
  email: 'admin',
  password: 'admin',
};

const userCredentials = {
  email: 'user',
  password: 'user',
};

module.exports = () => {
  const authenticatedAdmin = request.agent(app);
  const authenticatedUser = request.agent(app);

  before((done) => {
    authenticatedAdmin
      .get('logout')
      .end(() => {
        authenticatedAdmin
          .post('/login')
          .send(adminCredentials)
          .end((err, res) => {
            res.statusCode.should.equal(302);
            res.headers.location.should.equal('/');
            done();
          });
      });
  });

  before((done) => {
    authenticatedUser
      .get('logout')
      .end(() => {
        authenticatedUser
          .post('/login')
          .send(userCredentials)
          .end((err, res) => {
            res.statusCode.should.equal(302);
            res.headers.location.should.equal('/');
            done();
          });
      });
  });

  return {
    authenticatedAdmin,
    authenticatedUser,
  };
};
