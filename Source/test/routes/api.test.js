/* Packages */
const chai = require('chai');
const request = require('supertest');
const app = require('./../../bin/www');

chai.should();

const {
  authenticatedAdmin,
  authenticatedUser,
} = require('./../authenticatedUser');

describe('GET /api', () => {
  it('should redirect to /map for any unknown path', (done) => {
    authenticatedUser.get('/api/asdf')
      .end((err, res) => {
        res.statusCode.should.equal(302);
        res.headers.location.should.equal('/map');
        done();
      });
  });

  it('should redirect to /map for any unknown path', (done) => {
    authenticatedAdmin.get('/api/asdf')
      .end((err, res) => {
        res.statusCode.should.equal(302);
        res.headers.location.should.equal('/map');
        done();
      });
  });

  it('should return a 302 response and redirect to /login', (done) => {
    request(app).get('/api')
      .end((err, res) => {
        res.statusCode.should.equal(302);
        res.headers.location.should.equal('/login');
        done();
      });
  });
});
