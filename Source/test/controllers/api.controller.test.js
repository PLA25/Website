/* Packages */
const app = require('./../../bin/www');
const chai = require('chai');
const fs = require('fs');
const isCI = require('is-ci');
const path = require('path');
const request = require('supertest');

/* Constants */
const {
  authenticatedAdmin,
  authenticatedUser,
} = require('./../authenticatedUser')();

chai.should();

function deleteFolderRecursive(folderPath) {
  if (fs.existsSync(folderPath)) {
    fs.readdirSync(folderPath).forEach((file) => {
      const curPath = `${folderPath}/${file}`;
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(folderPath);
  }
}

/* Constants */
const cacheFolder = path.resolve(`${__dirname}./../../cache`);

module.exports = () => {
  before((done) => {
    if (isCI) {
      deleteFolderRecursive(cacheFolder);
    }

    done();
  });

  describe('GET /:host/:z/:x/:y', () => {
    describe('Not logged in', () => {
      it('should redirect to /login', (done) => {
        request(app).get('/api/mapbox/8/132/86')
          .end((err, res) => {
            res.headers.location.should.equal('/login');
            done();
          });
      });
    });

    describe('Logged in admin', () => {
      it('should return a 200 response for /mapbox/8/132/86', (done) => {
        const imagePath = path.resolve(cacheFolder, 'mapbox', '8_132_86.png');
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }

        authenticatedAdmin.get('/api/mapbox/8/132/86')
          .end((err, res) => {
            res.statusCode.should.equal(200);
            done();
          });
      });

      it('should return the previously downloaded /mapbox/8/132/86', (done) => {
        authenticatedAdmin.get('/api/mapbox/8/132/86')
          .end((err, res) => {
            res.statusCode.should.equal(200);
            done();
          });
      });

      it('should return a 200 response for /planet/8/132/86', (done) => {
        const imagePath = path.resolve(cacheFolder, 'planet', '8_132_86.png');
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }

        authenticatedAdmin.get('/api/planet/8/132/86')
          .end((err, res) => {
            res.statusCode.should.equal(200);
            done();
          });
      }).timeout(5000);

      it('should return the errorImage for any unknown host', (done) => {
        authenticatedAdmin.get('/api/asdf/1/1/1')
          .end((err, res) => {
            res.statusCode.should.equal(200);
            done();
          });
      });
    });

    describe('Logged in user', () => {
      it('should return a 200 response for /mapbox/8/132/86', (done) => {
        const imagePath = path.resolve(cacheFolder, 'mapbox', '8_132_86.png');
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }

        authenticatedUser.get('/api/mapbox/8/132/86')
          .end((err, res) => {
            res.statusCode.should.equal(200);
            done();
          });
      });

      it('should return the previously downloaded /mapbox/8/132/86', (done) => {
        authenticatedUser.get('/api/mapbox/8/132/86')
          .end((err, res) => {
            res.statusCode.should.equal(200);
            done();
          });
      });

      it('should return a 200 response for /planet/8/132/86', (done) => {
        const imagePath = path.resolve(cacheFolder, 'planet', '8_132_86.png');
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }

        authenticatedUser.get('/api/planet/8/132/86')
          .end((err, res) => {
            res.statusCode.should.equal(200);
            done();
          });
      }).timeout(5000);

      it('should return the errorImage for any unknown host', (done) => {
        authenticatedUser.get('/api/asdf/1/1/1')
          .end((err, res) => {
            res.statusCode.should.equal(200);
            done();
          });
      });
    });
  });

  describe('GET /heatmap/:z/:x/:y', () => {
    describe('Not logged in', () => {
      it('should redirect to /login', (done) => {
        const imagePath = path.resolve(cacheFolder, 'heatmap', '8_132_86.png');
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }

        request(app).get('/api/heatmap/8/132/86')
          .end((err, res) => {
            res.headers.location.should.equal('/login');
            done();
          });
      });
    });

    describe('Logged in admin', () => {
      it('should create any missing folder(s)', (done) => {
        deleteFolderRecursive(cacheFolder);

        authenticatedAdmin.get('/api/heatmap/8/132/86')
          .end((err, res) => {
            res.statusCode.should.equal(200);
            done();
          });
      });

      it('should return a 200 response for /heatmap/8/132/86', (done) => {
        const imagePath = path.resolve(cacheFolder, 'heatmap', '8_132_86.png');
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }

        authenticatedAdmin.get('/api/heatmap/8/132/86')
          .end((err, res) => {
            res.statusCode.should.equal(200);
            done();
          });
      });
    });

    describe('Logged in user', () => {
      it('should create any missing folder(s)', (done) => {
        deleteFolderRecursive(cacheFolder);

        authenticatedAdmin.get('/api/heatmap/8/132/86')
          .end((err, res) => {
            res.statusCode.should.equal(200);
            done();
          });
      });

      it('should return a 200 response for /heatmap/8/132/86', (done) => {
        const imagePath = path.resolve(cacheFolder, 'heatmap', '8_132_86.png');
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }

        authenticatedAdmin.get('/api/heatmap/8/132/86')
          .end((err, res) => {
            res.statusCode.should.equal(200);
            done();
          });
      });
    });
  });

  describe('GET /sensorhubs', () => {
    describe('Not logged in', () => {
      it('should redirect to /login', (done) => {
        request(app).get('/api/sensorhubs')
          .end((err, res) => {
            res.headers.location.should.equal('/login');
            done();
          });
      });
    });

    describe('Logged in admin', () => {
      it('should return a 200 response', (done) => {
        authenticatedAdmin.get('/api/sensorhubs')
          .end((err, res) => {
            res.statusCode.should.equal(200);
            done();
          });
      });
    });

    describe('Logged in user', () => {
      it('should return a 200 response', (done) => {
        authenticatedUser.get('/api/sensorhubs')
          .end((err, res) => {
            res.statusCode.should.equal(200);
            done();
          });
      });
    });
  });
};
