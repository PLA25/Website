/* Packages */
const chai = require('chai');
const request = require('supertest');
const app = require('./../../bin/www');

chai.should();

const {
  authenticatedAdmin,
  authenticatedUser,
} = require('./../authenticatedUser');

describe('GET /api', () => {
  describe('General', () => {
    it('should redirect to /map for any unknown path', (done) => {
      authenticatedAdmin.get('/api')
        .end((err, res) => {
          res.statusCode.should.equal(302);
          res.headers.location.should.equal('/map');
          done();
        });
    });

    it('should redirect to /map for any unknown path', (done) => {
      authenticatedUser.get('/api')
        .end((err, res) => {
          res.statusCode.should.equal(302);
          res.headers.location.should.equal('/map');
          done();
        });
    });

    it('should return a 302 response and redirect to /login', (done) => {
      request(app).get('/api')
        .end((err, res) => {
          res.statusCode.should.equal(302);
          res.headers.location.should.equal('/login');
          done();
        });
    });
  });

  describe('GET /api/meetpunten', () => {
    it('should return a 200 response if the user is logged in', (done) => {
      authenticatedUser.get('/api/meetpunten')
        .end((err, res) => {
          res.statusCode.should.equal(200);
          done();
        });
    });

    it('should return a 200 response if the admin is logged in', (done) => {
      authenticatedAdmin.get('/api/meetpunten')
        .end((err, res) => {
          res.statusCode.should.equal(200);
          done();
        });
    });
  });

  describe('GET /api/:host/:z/:x/:y', () => {
    it('should return a 200 response if the user is logged in', (done) => {
      authenticatedAdmin.get('/api/planet/1/1/1')
        .end((err, res) => {
          res.statusCode.should.equal(200);
          done();
        });
    });

    it('should return a 200 response if the user is logged in', (done) => {
      authenticatedUser.get('/api/planet/1/1/1')
        .end((err, res) => {
          res.statusCode.should.equal(200);
          done();
        });
    });

    it('should return a 200 response if the admin is logged in', (done) => {
      authenticatedAdmin.get('/api/mapbox/1/1/1')
        .end((err, res) => {
          res.statusCode.should.equal(200);
          done();
        });
    });

    it('should return a 200 response if the admin is logged in', (done) => {
      authenticatedUser.get('/api/mapbox/1/1/1')
        .end((err, res) => {
          res.statusCode.should.equal(200);
          done();
        });
    });

    it('should return a 404 response if the admin is logged in', (done) => {
      authenticatedAdmin.get('/api/asdf/1/1/1')
        .end((err, res) => {
          res.statusCode.should.equal(404);
          done();
        });
    });

    it('should return a 404 response if the user is logged in', (done) => {
      authenticatedUser.get('/api/asdf/1/1/1')
        .end((err, res) => {
          res.statusCode.should.equal(404);
          done();
        });
    });
  });

  describe('GET /api/heatmap/:z/:x/:y', () => {
    it('should return a 200 response if the admin is logged in', (done) => {
      authenticatedAdmin.get('/api/heatmap/1/1/1')
        .end((err, res) => {
          res.statusCode.should.equal(200);
          done();
        });
    });

    it('should return a 200 response if the user is logged in', (done) => {
      authenticatedUser.get('/api/heatmap/1/1/1')
        .end((err, res) => {
          res.statusCode.should.equal(200);
          done();
        });
    });
  });
});
