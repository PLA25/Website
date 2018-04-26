/* Packages */
const chai = require('chai');
const fs = require('fs');
const path = require('path');
const request = require('supertest');
const app = require('./../../bin/www');

/* Constants */
const {
  authenticatedAdmin,
  authenticatedUser,
} = require('./../authenticatedUser')();

chai.should();

/* Constants */
const logoPath = path.resolve(`${__dirname}./../../public`, 'logo.png');
const defaultLogoPath = path.resolve(`${__dirname}./../../public`, 'default_logo.png');
const expectedLogo = path.resolve(`${__dirname}./../expected`, 'polar_bear.png');

module.exports = () => {
  describe('GET /', () => {
    describe('Not logged in', () => {
      it('should redirect to /login', (done) => {
        request(app)
          .get('/admin')
          .end((err, res) => {
            res.headers.location.should.equal('/login');
            done();
          });
      });
    });

    describe('Logged in admin', () => {
      it('should return a 200 response', (done) => {
        authenticatedAdmin
          .get('/admin')
          .end((err, res) => {
            res.statusCode.should.equal(200);
            done();
          });
      });
    });

    describe('Logged in user', () => {
      it('should return a 200 response', (done) => {
        authenticatedUser
          .get('/admin')
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
        request(app)
          .post('/admin/upload-logo')
          .end((err, res) => {
            res.headers.location.should.equal('/login');
            done();
          });
      });
    });

    describe('Logged in admin', () => {
      it('should return a 200 response if the upload was succesful', (done) => {
        authenticatedAdmin
          .post('/admin/upload-logo')
          .attach('logo', './test/expected/polar_bear.png')
          .end((err, res) => {
            res.statusCode.should.equal(200);
            fs.readFileSync(logoPath).should.deep.equal(fs.readFileSync(expectedLogo));
            fs.readFileSync(logoPath).should.not.deep.equal(fs.readFileSync(defaultLogoPath));
            done();
          });
      });

      it('should return a 200 response', (done) => {
        authenticatedAdmin
          .post('/admin/upload-logo')
          .attach('logo', './public/logo.png')
          .end((err, res) => {
            res.statusCode.should.equal(200);
            done();
          });
      });
    });

    describe('Logged in user', () => {
      it('should return a 200 response', (done) => {
        authenticatedUser
          .post('/admin/upload-logo')
          .end((err, res) => {
            res.headers.location.should.equal('/404');
            done();
          });
      });
    });
  });
};
