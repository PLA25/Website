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
const defaultLogoPath = path.resolve(`${__dirname}./../expected`, 'default_logo.png');
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

  /*
   * describe('GET /flip/:id', () => {
   * describe('Not logged in', () => {
   * it('should redirect to /login', (done) => {
   * request(app)
   * .get('/admin/flip/asdf')
   * .end((err, res) => {
   * res.headers.location.should.equal('/login');
   * done();
   * });
   * });
   * });
   *
   * describe('Logged in admin', () => {
   * it('should return a 302 response', (done) => {
   * authenticatedAdmin
   * .get('/admin/flip/5b0d2986fe7dc44b5457fd63')
   * .end((err, res) => {
   * res.statusCode.should.equal(302);
   * done();
   * });
   * });
   *
   * it('should return a 302 response', (done) => {
   * authenticatedAdmin
   * .get('/admin/flip/5b0d2986fe7dc44b5457fd63')
   * .end((err, res) => {
   * res.statusCode.should.equal(302);
   * done();
   * });
   * });
   *
   * it('should return a 302 response', (done) => {
   * authenticatedAdmin
   * .get('/admin/flip/5b0d2986fe7dc44b5457fd7c')
   * .end((err, res) => {
   * res.statusCode.should.equal(302);
   * done();
   * });
   * });
   *
   * it('should return a 302 response', (done) => {
   * authenticatedAdmin
   * .get('/admin/flip/5b0d2986fe7dc44b5457fd7c')
   * .end((err, res) => {
   * res.statusCode.should.equal(302);
   * done();
   * });
   * });
   *
   * it('should return a 302 response', (done) => {
   * authenticatedAdmin
   * .get('/admin/flip/5b0d2986fe7dc44b5457fdef')
   * .end((err, res) => {
   * res.statusCode.should.equal(302);
   * done();
   * });
   * });
   *
   * it('should return a 302 response', (done) => {
   * authenticatedAdmin
   * .get('/admin/flip/5b0d2986fe7dc44b5457fdef')
   * .end((err, res) => {
   * res.statusCode.should.equal(302);
   * done();
   * });
   * });
   *
   * it('should return a 500 response', (done) => {
   * authenticatedAdmin
   * .get('/admin/flip/asdf')
   * .end((err, res) => {
   * res.statusCode.should.equal(500);
   * done();
   * });
   * });
   * });
   *
   * describe('Logged in user', () => {
   * it('should return a 200 response', (done) => {
   * authenticatedUser
   * .get('/admin/flip/asdf')
   * .end((err, res) => {
   * res.headers.location.should.equal('/404');
   * done();
   * });
   * });
   * });
   * });
   */
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
      it('should return a 200 response for any PNG', (done) => {
        authenticatedAdmin
          .post('/admin/upload-logo')
          .attach('logo', './public/logo.png')
          .end((err, res) => {
            res.statusCode.should.equal(200);
            res.headers.location.should.equal('/admin');
            done();
          });
      });

      it('should return a 400 response for any non-PNG', (done) => {
        authenticatedAdmin
          .post('/admin/upload-logo')
          .attach('logo', './test/expected/default_logo.jpg')
          .end((err, res) => {
            res.statusCode.should.equal(400);
            res.headers.location.should.equal('/admin');
            done();
          });
      });

      it('should change the logo to the provided image', (done) => {
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

      it('should return a 400 response if there are no files attached', (done) => {
        authenticatedAdmin
          .post('/admin/upload-logo')
          .end((err, res) => {
            res.statusCode.should.equal(400);
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
