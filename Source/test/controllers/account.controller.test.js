/* Packages */
const chai = require('chai');
const bcrypt = require('bcrypt-nodejs');
const request = require('supertest');
const app = require('./../../bin/www');
const User = require('./../../models/user');

/* Constants */
const {
  authenticatedAdmin,
  authenticatedUser,
  authenticatedTestUser,
} = require('./../authenticatedUser')();

chai.should();

module.exports = () => {
  describe('GET /account', () => {
    describe('Not logged in (edit)', () => {
      it('should redirect to /login', (done) => {
        request(app)
          .get('/account/edit')
          .end((err, res) => {
            res.headers.location.should.equal('/login');
            done();
          });
      });
    });

    describe('Logged in admin (edit)', () => {
      it('should return a 200 response', (done) => {
        authenticatedAdmin
          .get('/account/edit')
          .end((err, res) => {
            res.statusCode.should.equal(200);
            done();
          });
      });
    });

    describe('Logged in user (edit)', () => {
      it('should return a 200 response', (done) => {
        authenticatedUser
          .get('/account/edit')
          .end((err, res) => {
            res.statusCode.should.equal(200);
            done();
          });
      });
    });

    describe('Not logged in', () => {
      it('should redirect to /login', (done) => {
        request(app)
          .get('/account')
          .end((err, res) => {
            res.headers.location.should.equal('/login');
            done();
          });
      });
    });

    describe('Logged in admin', () => {
      it('should return a 200 response', (done) => {
        authenticatedAdmin
          .get('/account')
          .end((err, res) => {
            res.statusCode.should.equal(200);
            done();
          });
      });
    });

    describe('Logged in user', () => {
      it('should return a 200 response', (done) => {
        authenticatedUser
          .get('/account')
          .end((err, res) => {
            res.statusCode.should.equal(200);
            done();
          });
      });
    });
  });

  describe('POST /account', () => {
    describe('Password change', () => {
      it('should change the password', (done) => {
        authenticatedTestUser
          .post('/account/edit')
          .send({
            oldPass: 'test',
            newPass: 'Test',
            repeatPass: 'Test',
            passChange: true,
          })
          .end(() => {
            User.findOne({
              email: 'test',
            }).exec().then((user) => {
              if (user) {
                const succeeded = (bcrypt.compareSync('Test', user.password)) ? 'OK' : 'ERROR';
                succeeded.should.equal('OK');
                // eslint-disable-next-line no-param-reassign
                user.password = bcrypt.hashSync('test', bcrypt.genSaltSync(8));
                user.save();
              }
              done();
            }).catch(() => {
              chai.assert.fail();
              done();
            });
          });
      });
    });

    describe('Incorrect password', () => {
      it('should redirect to /account/edit?fail=true', (done) => {
        authenticatedTestUser
          .post('/account/edit')
          .send({
            oldPass: 'Oepsie',
            newPass: 'Test',
            repeatPass: 'Test',
            passChange: true,
          })
          .end((err, res) => {
            res.headers.location.should.equal('/account/edit?fail=true');
            done();
          });
      });
    });

    describe('Repeat password does not match', () => {
      it('should redirect to /account/edit?fail=true', (done) => {
        authenticatedTestUser
          .post('/account/edit')
          .send({
            oldPass: 'test',
            newPass: 'Test',
            repeatPass: 'Testt',
            passChange: true,
          })
          .end((err, res) => {
            res.headers.location.should.equal('/account/edit?fail=true');
            done();
          });
      });
    });

    describe('No name specified', () => {
      it('should redirect to /account/edit?fail=true', (done) => {
        authenticatedUser
          .post('/account/edit')
          .send({
            nameChange: true,
          })
          .end((err, res) => {
            res.headers.location.should.equal('/account/edit?fail=true');
            done();
          });
      });
    });
  });
};
