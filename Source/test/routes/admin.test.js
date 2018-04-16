/* Packages */
const chai = require('chai');
const request = require('supertest');
const app = require('./../../bin/www');

chai.should();

const {
  authenticatedAdmin,
  authenticatedUser,
} = require('./../authenticatedUser');

module.exports = () => {
  describe('GET /admin', () => {
    it('should return a 302 response if the user is logged in', (done) => {
      authenticatedUser.get('/admin')
        .end((err, res) => {
          res.statusCode.should.equal(302);
          res.headers.location.should.equal('/404');
          done();
        });
    });

    it('should return a 200 response if the admin is logged in', (done) => {
      authenticatedAdmin.get('/admin')
        .end((err, res) => {
          res.statusCode.should.equal(200);
          done();
        });
    });

    it('should return a 302 response and redirect to /login', (done) => {
      request(app).get('/admin')
        .end((err, res) => {
          res.statusCode.should.equal(302);
          res.headers.location.should.equal('/login');
          done();
        });
    });
  });
};
