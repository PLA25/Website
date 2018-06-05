/* Packages */
const chai = require('chai');
//const bcrypt = require('bcrypt-nodejs');
const request = require('supertest');
const app = require('./../../bin/www');
// const User = require('./../../models/user');

// const salt = bcrypt.genSaltSync(8);

/* Constants */
const {
  authenticatedAdmin,
  authenticatedUser,
} = require('./../authenticatedUser')();

chai.should();

module.exports = () => {
  describe('GET /account', () => {
    describe('Not logged in', () => {
      it('should redirect to /login', (done) => {
        request(app)
          .get('/account/edit')
          .end((err, res) => {
            res.headers.location.should.equal('/login');
            done();
          });
      });
    });

    describe('Logged in admin', () => {
      it('should return a 200 response', (done) => {
        authenticatedAdmin
          .get('/account/edit')
          .end((err, res) => {
            res.statusCode.should.equal(200);
            done();
          });
      });
    });

    describe('Logged in user', () => {
      it('should return a 200 response', (done) => {
        authenticatedUser
          .get('/account/edit')
          .end((err, res) => {
            res.statusCode.should.equal(200);
            done();
          });
      });
    });
  });

  /*
   * describe('POST /account', () => {
   * describe('password', () => {
   * it('should change the password', (done) => {
   * authenticatedUser
   * .post('/account/edit')
   * .send({oldPass: "user", newPass: "User", repeatPass: "User", passChange: true})
   * .end((err, res) => {
   * User.findOne({email: "user"}).exec().then((user) => {
   * if (user) {
   * var pw = bcrypt.hashSync(user.password, salt);
   * pw.should.equal('User');
   * }
   * done();
   * });
   * });
   * });
   *});
   */

  /*
   * describe('incorrect password', () => {
   * it('should redirect to /account/edit?fail=true', (done) => {
   * authenticatedUser
   * .post('/account/edit')
   * .send()
   * .end((err, res) => {
   * res.headers.location.should.equal('/account/edit');
   * done();
   * })
   * })
   * });
   *});
   */
};
