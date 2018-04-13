/* Packages */
const chai = require('chai');
const request = require('supertest');
const app = require('./../../app');

chai.should();

const userCredentials = {
  email: 'admin',
  password: 'admin',
};

const authenticatedUser = request.agent(app);
before((done) => {
  authenticatedUser
    .post('/login')
    .send(userCredentials)
    .end((err, res) => {
      res.statusCode.should.equal(302);
      res.headers.location.should.equal('/');
      done();
    });
});

describe('GET /profile', () => {
  it('should return a 200 response if the user is logged in', (done) => {
    authenticatedUser.get('/map')
      .end((err, response) => {
        response.statusCode.should.equal(200);
        done();
      });
  });

  it('should return a 302 response and redirect to /login', (done) => {
    request(app).get('/map')
      .end((err, res) => {
        res.statusCode.should.equal(302);
        res.headers.location.should.equal('/login');
        done();
      });
  });
});
