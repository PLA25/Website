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
        request(app).get('/')
          .end((err, res) => {
            res.headers.location.should.equal('/login');
            done();
          });
      });
    });

    describe('Logged in admin', () => {
      it('should return a 200 response', (done) => {
        authenticatedAdmin.get('/')
          .end((err, res) => {
            res.statusCode.should.equal(200);
            done();
          });
      });
    });

    describe('Logged in user', () => {
      it('should return a 200 response', (done) => {
        authenticatedUser.get('/')
          .end((err, res) => {
            res.statusCode.should.equal(200);
            done();
          });
      });
    });
  });

  describe('GET /login', () => {
    describe('Not logged in', () => {
      it('should return a 200 response', (done) => {
        request(app).get('/login')
          .end((err, res) => {
            res.statusCode.should.equal(200);
            done();
          });
      });
    });

    describe('Logged in admin', () => {
      it('should redirect to /', (done) => {
        authenticatedAdmin.get('/login')
          .end((err, res) => {
            res.headers.location.should.equal('/');
            done();
          });
      });
    });

    describe('Logged in user', () => {
      it('should redirect to /', (done) => {
        authenticatedUser.get('/login')
          .end((err, res) => {
            res.headers.location.should.equal('/');
            done();
          });
      });
    });
  });

  describe('GET /map', () => {
    describe('Not logged in', () => {
      it('should redirect to /login', (done) => {
        request(app).get('/')
          .end((err, res) => {
            res.headers.location.should.equal('/login');
            done();
          });
      });
    });

    describe('Logged in admin', () => {
      it('should return a 200 response', (done) => {
        authenticatedAdmin.get('/map')
          .end((err, res) => {
            res.statusCode.should.equal(200);
            done();
          });
      });
    });

    describe('Logged in user', () => {
      it('should return a 200 response', (done) => {
        authenticatedUser.get('/map')
          .end((err, res) => {
            res.statusCode.should.equal(200);
            done();
          });
      });
    });
  });

  describe('GET /locale-:locale', () => {
    describe('Not logged in', () => {
      it('should return a 302 response', (done) => {
        request(app).get('/locale-nl')
          .end((err, res) => {
            res.statusCode.should.equal(302);
            res.headers.location.should.equal('/');
            done();
          });
      });

      it('should return the dutch version of the login page', (done) => {
        request(app).get('/locale-nl')
          .end((err, res1) => {
            res1.statusCode.should.equal(302);
            res1.headers.location.should.equal('/');

            request(app).get('/login')
              .end((err2, res2) => {
                res2.statusCode.should.equal(200);
                res2.text.should.include('Uw e-mail');
                done();
              });
          });
      });

      it('should return the english version of the login page', (done) => {
        request(app).get('/locale-nl')
          .end((err1, res1) => {
            res1.statusCode.should.equal(302);
            res1.headers.location.should.equal('/');

            request(app).get('/locale-en')
              .end((err2, res2) => {
                res2.statusCode.should.equal(302);
                res2.headers.location.should.equal('/');

                request(app).get('/login')
                  .end((err3, res3) => {
                    res3.statusCode.should.equal(200);
                    res3.text.should.include('Your email');
                    done();
                  });
              });
          });
      });
    });

    describe('Logged in admin', () => {
      it('should return a 302 response', (done) => {
        authenticatedAdmin.get('/locale-nl')
          .end((err, res) => {
            res.statusCode.should.equal(302);
            res.headers.location.should.equal('/');
            done();
          });
      });

      it('should return the dutch version of the index page', (done) => {
        authenticatedAdmin.get('/locale-nl')
          .end((err, res) => {
            res.statusCode.should.equal(302);
            res.headers.location.should.equal('/');

            authenticatedAdmin.get('/')
              .end((err2, res2) => {
                res2.statusCode.should.equal(200);
                res2.text.should.include('Welkom bij de homepagina');
                done();
              });
          });
      });

      it('should return the english version of the index page', (done) => {
        authenticatedAdmin.get('/locale-nl')
          .end((err, res) => {
            res.statusCode.should.equal(302);
            res.headers.location.should.equal('/');

            authenticatedAdmin.get('/locale-en')
              .end((err2, res2) => {
                res2.statusCode.should.equal(302);
                res2.headers.location.should.equal('/');

                authenticatedAdmin.get('/')
                  .end((err3, res3) => {
                    res3.statusCode.should.equal(200);
                    res3.text.should.include('Welcome to the homepage');
                    done();
                  });
              });
          });
      });
    });

    describe('Logged in user', () => {
      it('should return a 302 response', (done) => {
        authenticatedUser.get('/locale-nl')
          .end((err, res) => {
            res.statusCode.should.equal(302);
            res.headers.location.should.equal('/');
            done();
          });
      });

      it('should return the dutch version of the index page', (done) => {
        authenticatedUser.get('/locale-nl')
          .end((err, res) => {
            res.statusCode.should.equal(302);
            res.headers.location.should.equal('/');

            authenticatedUser.get('/')
              .end((err2, res2) => {
                res2.statusCode.should.equal(200);
                res2.text.should.include('Welkom bij de homepagina');
                done();
              });
          });
      });

      it('should return the english version of the index page', (done) => {
        authenticatedUser.get('/locale-nl')
          .end((err, res) => {
            res.statusCode.should.equal(302);
            res.headers.location.should.equal('/');

            authenticatedUser.get('/locale-en')
              .end((err2, res2) => {
                res2.statusCode.should.equal(302);
                res2.headers.location.should.equal('/');

                authenticatedUser.get('/')
                  .end((err3, res3) => {
                    res3.statusCode.should.equal(200);
                    res3.text.should.include('Welcome to the homepage');
                    done();
                  });
              });
          });
      });
    });
  });

  describe('GET /sensorhub/:SerialID', () => {
    describe('Not logged in', () => {
      it('should redirect to /login', (done) => {
        request(app).get('/sensorhub/Groningen')
          .end((err, res) => {
            res.headers.location.should.equal('/login');
            done();
          });
      });
    });

    describe('Logged in admin', () => {
      it('should return a 200 response', (done) => {
        authenticatedAdmin.get('/sensorhub/Groningen')
          .end((err, res) => {
            res.statusCode.should.equal(200);
            done();
          });
      });

      it('should return a 500 response for an unknown host', (done) => {
        authenticatedAdmin.get('/sensorhub/asdf')
          .end((err, res) => {
            res.statusCode.should.equal(500);
            done();
          });
      });
    });

    describe('Logged in user', () => {
      it('should return a 200 response', (done) => {
        authenticatedUser.get('/sensorhub/Groningen')
          .end((err, res) => {
            res.statusCode.should.equal(200);
            done();
          });
      });

      it('should return a 500 response for an unknown host', (done) => {
        authenticatedUser.get('/sensorhub/asdf')
          .end((err, res) => {
            res.statusCode.should.equal(500);
            done();
          });
      });
    });
  });

  describe('GET non-existing page', () => {
    describe('Not logged in', () => {
      it('should return a 404 response', (done) => {
        request(app).get('/non-existing-page')
          .end((err, res) => {
            res.statusCode.should.equal(404);
            done();
          });
      });
    });

    describe('Logged in admin', () => {
      it('should return a 404 response', (done) => {
        authenticatedAdmin.get('/non-existing-page')
          .end((err, res) => {
            res.statusCode.should.equal(404);
            done();
          });
      });
    });

    describe('Logged in user', () => {
      it('should return a 404 response', (done) => {
        authenticatedUser.get('/non-existing-page')
          .end((err, res) => {
            res.statusCode.should.equal(404);
            done();
          });
      });
    });
  });

  /* Must be last! */
  describe('GET /logout', () => {
    describe('Not logged in', () => {
      it('should redirect to /login', (done) => {
        request(app).get('/logout')
          .end((err, res) => {
            res.headers.location.should.equal('/login');
            done();
          });
      });
    });

    describe('Logged in admin', () => {
      it('should redirect to /login', (done) => {
        authenticatedAdmin.get('/logout')
          .end((err, res) => {
            res.headers.location.should.equal('/login');
            done();
          });
      });
    });

    describe('Logged in user', () => {
      it('should redirect to /login', (done) => {
        authenticatedUser.get('/logout')
          .end((err, res) => {
            res.headers.location.should.equal('/login');
            done();
          });
      });
    });
  });
};
