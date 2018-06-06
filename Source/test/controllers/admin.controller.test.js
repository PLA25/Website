/* Packages */
const chai = require('chai');
const fs = require('fs');
const path = require('path');
const request = require('supertest');
const app = require('./../../bin/www');
const isCI = require('is-ci');

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

  describe('GET /flip/:id', () => {
    describe('Not logged in', () => {
      it('should redirect to /login', (done) => {
        request(app)
          .get('/admin/flip/asdf')
          .end((err, res) => {
            res.headers.location.should.equal('/login');
            done();
          });
      });
    });

    describe('Logged in admin', () => {
      if (!isCI) {
        it('should return a 302 response', (done) => {
          authenticatedAdmin
            .get('/admin/flip/5b14530413f3a72700117dc9')
            .end((err, res) => {
              res.statusCode.should.equal(302);
              done();
            });
        });

        it('should return a 302 response', (done) => {
          authenticatedAdmin
            .get('/admin/flip/5b14530413f3a72700117dc9')
            .end((err, res) => {
              res.statusCode.should.equal(302);
              done();
            });
        });

        it('should return a 302 response', (done) => {
          authenticatedAdmin
            .get('/admin/flip/5b14530413f3a72700117dce')
            .end((err, res) => {
              res.statusCode.should.equal(302);
              done();
            });
        });

        it('should return a 302 response', (done) => {
          authenticatedAdmin
            .get('/admin/flip/5b14530413f3a72700117dce')
            .end((err, res) => {
              res.statusCode.should.equal(302);
              done();
            });
        });

        it('should return a 302 response', (done) => {
          authenticatedAdmin
            .get('/admin/flip/5b14530413f3a72700117dd3')
            .end((err, res) => {
              res.statusCode.should.equal(302);
              done();
            });
        });

        it('should return a 302 response', (done) => {
          authenticatedAdmin
            .get('/admin/flip/5b14530413f3a72700117dd3')
            .end((err, res) => {
              res.statusCode.should.equal(302);
              done();
            });
        });
      }

      it('should return a 500 response', (done) => {
        authenticatedAdmin
          .get('/admin/flip/asdf')
          .end((err, res) => {
            res.statusCode.should.equal(500);
            done();
          });
      });
    });

    describe('Logged in user', () => {
      it('should redirect to /404', (done) => {
        authenticatedUser
          .get('/admin/flip/asdf')
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

  describe('GET /editsensor/:SerialID', () => {
    describe('Not logged in', () => {
      it('should redirect to /login', (done) => {
        request(app)
          .get('/admin/editsensor/asdf')
          .end((err, res) => {
            res.headers.location.should.equal('/login');
            done();
          });
      });
    });

    it('should return a 500 response', (done) => {
      authenticatedAdmin
        .get('/admin/editsensor/asdf')
        .end((err, res) => {
          res.statusCode.should.equal(500);
          done();
        });
    });

    describe('Logged in user', () => {
      it('should redirect to /404', (done) => {
        authenticatedUser
          .get('/admin/editsensor/asdf')
          .end((err, res) => {
            res.headers.location.should.equal('/404');
            done();
          });
      });
    });
    describe('Logged in admin', () => {
      it('should return a 200 response', (done) => {
        authenticatedAdmin
          .get('/admin/editsensor/Arnhem')
          .end((err, res) => {
            res.statusCode.should.equal(200);
            done();
          });
      });
    });
  });

  describe('GET /config/:valueID', () => {
    describe('Not logged in', () => {
      it('should redirect to /login', (done) => {
        request(app)
          .get('/admin/config/asdf')
          .end((err, res) => {
            res.headers.location.should.equal('/login');
            done();
          });
      });
    });

    it('should return a 500 response', (done) => {
      authenticatedAdmin
        .get('/admin/config/asdf')
        .end((err, res) => {
          res.statusCode.should.equal(500);
          done();
        });
    });

    describe('Logged in user', () => {
      it('should redirect to /404', (done) => {
        authenticatedUser
          .get('/admin/config/asdf')
          .end((err, res) => {
            res.headers.location.should.equal('/404');
            done();
          });
      });
    });

    describe('Logged in admin', () => {
      it('should return a 200 response', (done) => {
        authenticatedAdmin
          .get('/admin/config/treshold-temperature')
          .end((err, res) => {
            res.statusCode.should.equal(200);
            done();
          });
      });
    });
  });

  describe('POST /admin/editsensor/:SerialID', () => {
    describe('Not logged in', () => {
      it('should redirect to /login', (done) => {
        request(app)
          .post('/admin/editsensor/asdf')
          .end((err, res) => {
            res.headers.location.should.equal('/login');
            done();
          });
      });
    });

    describe('Logged in admin', () => {
      it('should return a 500 response', (done) => {
        authenticatedAdmin
          .post('/admin/editsensor/asdf')
          .end((err, res) => {
            res.statusCode.should.equal(500);
            done();
          });
      });

      it('should redirect to /admin', (done) => {
        authenticatedAdmin
          .post('/admin/editsensor/Arnhem')
          .send({
            Longitude: '5.898730',
            Latitude: '51.985103',
          })
          .end((err, res) => {
            res.headers.location.should.equal('/admin');
            done();
          });
      });

      it('should return a 500 response', (done) => {
        authenticatedAdmin
          .post('/admin/editsensor/asdf')
          .send({
            Longitude: '5.898730',
          })
          .end((err, res) => {
            res.statusCode.should.equal(500);
            done();
          });
      });

      it('should return a 500 response', (done) => {
        authenticatedAdmin
          .post('/admin/editsensor/asdf')
          .send({
            Latitude: '51.985103',
          })
          .end((err, res) => {
            res.statusCode.should.equal(500);
            done();
          });
      });
    });

    describe('Logged in user', () => {
      it('should redirect to /404', (done) => {
        authenticatedUser
          .post('/admin/editsensor/asdf')
          .end((err, res) => {
            res.headers.location.should.equal('/404');
            done();
          });
      });
    });

    describe('POST /admin/config/:valueID', () => {
      describe('Not logged in', () => {
        it('should redirect to /login', (done) => {
          request(app)
            .post('/admin/config/asdf')
            .end((err, res) => {
              res.headers.location.should.equal('/login');
              done();
            });
        });
      });

      describe('Logged in admin', () => {
        it('should return a 302 response', (done) => {
          authenticatedAdmin
            .post('/admin/config/asdf')
            .end((err, res) => {
              res.statusCode.should.equal(302);
              res.headers.location.should.equal('/admin');
              done();
            });
        });

        it('should return a 500 response', (done) => {
          authenticatedAdmin
            .post('/admin/config/asdf')
            .send({
              value: 0.5,
            })
            .end((err, res) => {
              res.statusCode.should.equal(500);
              done();
            });
        });

        it('should return a 302 response', (done) => {
          authenticatedAdmin
            .post('/admin/config/treshold-temperature')
            .send({
              value: 0.75,
            })
            .end((err, res) => {
              res.statusCode.should.equal(302);
              done();
            });
        });
      });

      describe('Logged in user', () => {
        it('should redirect to /404', (done) => {
          authenticatedUser
            .post('/admin/config/asdf')
            .end((err, res) => {
              res.headers.location.should.equal('/404');
              done();
            });
        });
      });
    });
  });
};
