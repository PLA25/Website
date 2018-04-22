/* Packages */
const app = require('./../../bin/www');
const chai = require('chai');
const request = require('supertest');

chai.should();

describe('Config', () => {
  describe('Passport', () => {
    it('should return an error if the username doesn\'t exist in the database', (done) => {
      request(app)
        .post('/login')
        .send({
          email: 'invalid',
          password: 'invalid',
        })
        .end((err, res) => {
          res.headers.location.should.equal('/login');
          done();
        });
    });

    it('should return an error if the password doesn\'t match', (done) => {
      request(app)
        .post('/login')
        .send({
          email: 'admin',
          password: 'invalid',
        })
        .end((err, res) => {
          res.headers.location.should.equal('/login');
          done();
        });
    });
  });
});
