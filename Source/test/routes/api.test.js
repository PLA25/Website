/* Packages */
const fs = require('fs');
const path = require('path');
const chai = require('chai');
const request = require('supertest');
const app = require('./../../bin/www');

chai.should();

const {
  authenticatedAdmin,
  authenticatedUser,
} = require('./../authenticatedUser');

module.exports = () => {
  describe('GET /', () => {
    it('should redirect to /map for any unknown path', (done) => {
      authenticatedUser.get('/api/asdf')
        .end((err, res) => {
          res.statusCode.should.equal(302);
          res.headers.location.should.equal('/map');
          done();
        });
    });

    it('should redirect to /map for any unknown path', (done) => {
      authenticatedAdmin.get('/api/asdf')
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

  describe('GET /meetpunten', () => {
    it('should return a 200 response', (done) => {
      authenticatedUser.get('/api/meetpunten')
        .end((err, res) => {
          res.statusCode.should.equal(200);
          done();
        });
    });

    it('should return MIME type application/vnd.google-earth.kml+xml', (done) => {
      authenticatedUser.get('/api/meetpunten')
        .end((err, res) => {
          res.statusCode.should.equal(200);
          res.get('Content-Type').should.have.string('application/vnd.google-earth.kml+xml');
          done();
        });
    });
  });

  describe('GET /:host/:z/:x/:y', () => {
    it('should return a 404 response for an unknown host', (done) => {
      authenticatedUser.get('/api/asdf/1/1/1')
        .end((err, res) => {
          res.statusCode.should.equal(404);
          done();
        });
    });

    it('should return a 200 response for /mapbox/8/132/86', (done) => {
      const imagePath = path.resolve(`${__dirname}./../../cache/mapbox/8_132_86.png`);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }

      authenticatedUser.get('/api/mapbox/8/132/86')
        .end((err, res) => {
          res.statusCode.should.equal(200);
          done();
        });
    });

    it('should return a 200 response for /planet/8/132/86', (done) => {
      const imagePath = path.resolve(`${__dirname}./../../cache/planet/8_132_86.png`);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }

      authenticatedUser.get('/api/planet/8/132/86')
        .end((err, res) => {
          res.statusCode.should.equal(200);
          done();
        });
    }).timeout(2500);
  });

  describe('GET /heatmap/:z/:x/:y', () => {
    it('should return a 200 response', (done) => {
      authenticatedUser.get('/api/heatmap/8/132/86')
        .end((err, res) => {
          res.statusCode.should.equal(200);
          done();
        });
    });

    it('should return a 200 response', (done) => {
      const imagePath = path.resolve(`${__dirname}./../../cache/heatmap/8_132_86.png`);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }

      authenticatedUser.get('/api/heatmap/8/132/86')
        .end((err, res) => {
          res.statusCode.should.equal(200);
          done();
        });
    });
  });
};
