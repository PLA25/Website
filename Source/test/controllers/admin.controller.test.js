/* Packages */
const chai = require('chai');
const request = require('supertest');
const app = require('./../../bin/www');

/* Constants */
const {
  authenticatedAdmin,
  authenticatedUser,
} = require('./../authenticatedUser')();

chai.should();

module.exports = () => {
  describe('GET /', () => {
    describe('Not logged in', () => {
      it('should redirect to /login', (done) => {
        request(app).get('/admin')
          .end((err, res) => {
            res.headers.location.should.equal('/login');
            done();
          });
      });
    });

    describe('Logged in admin', () => {
      it('should return a 200 response', (done) => {
        authenticatedAdmin.get('/admin')
          .end((err, res) => {
            res.statusCode.should.equal(200);
            done();
          });
      });
    });

    describe('Logged in user', () => {
      it('should return a 200 response', (done) => {
        authenticatedUser.get('/admin')
          .end((err, res) => {
            res.headers.location.should.equal('/404');
            done();
          });
      });
    });
  });

  describe('POST /upload-logo', () => {
    describe('Not logged in', () => {
      it('should redirect to /login', (done) => {
        request(app).post('/admin/upload-logo')
          .end((err, res) => {
            res.headers.location.should.equal('/login');
            done();
          });
      });
    });

    describe('Logged in admin', () => {
      it('should return a 200 response', (done) => {
        authenticatedAdmin.post('/admin/upload-logo')
          .end((err, res) => {
            res.statusCode.should.equal(400);
            done();
          });
      });
    });

    describe('Logged in user', () => {
      it('should return a 200 response', (done) => {
        authenticatedUser.post('/admin/upload-logo')
          .end((err, res) => {
            res.headers.location.should.equal('/404');
            done();
          });
      });
    });
  });
};
