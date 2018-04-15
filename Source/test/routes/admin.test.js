/* Packages */
const chai = require('chai');
/*
 * const request = require('supertest');
 * const app = require('./../../bin/www');
 */
chai.should();

const {
  authenticatedAdmin,
  authenticatedUser,
} = require('./../authenticatedUser');

module.exports = () => {
  describe('/ALL *', () => {
    it('should redirect to /404 if the user is not an admin', (done) => {
      authenticatedUser.get('/admin')
        .end((err, res) => {
          res.statusCode.should.equal(404);
          res.headers.location.should.equal('/404');
          done();
        });
    });

    it('should continue resume any request of an admin', (done) => {
      authenticatedAdmin.get('/admin')
        .end((err, res) => {
          res.statusCode.should.equal(200);
          done();
        });
    });
  });
};
