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

/*
 * 1512086400000 = 12/01/2017 @ 12:00am (UTC)
 * 1514764800000 = 01/01/2018 @ 12:00am (UTC)
 * 1525132800000 = 05/01/2018 @ 12:00am (UTC)
 * 1526428800000 = 05/14/2018 @ 12:00am (UTC)
 * 1546300800000 = 01/01/2019 @ 12:00am (UTC)
 */

module.exports = () => {
  before((done) => {
    if (isCI) {
      deleteFolderRecursive(cacheFolder);
    }

    done();
  });

  describe('ALL *', () => {
    it('should create any missing folder(s)', (done) => {
      deleteFolderRecursive(cacheFolder);

      authenticatedAdmin.get('/api')
        .end((err, res) => {
          res.statusCode.should.equal(404);
          done();
        });
    });

    it('should create an errorImage', (done) => {
      const imagePath = path.resolve(cacheFolder, '-1_-1_-1.png');
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }

      authenticatedAdmin.get('/api')
        .end((err, res) => {
          res.statusCode.should.equal(404);
          done();
        });
    });
  });

  describe('GET /:type/:dateTime/:z/:x/:y', () => {
    describe('*', () => {
      describe('Not logged in', () => {
        it('should redirect to /login', (done) => {
          request(app).get('/api/gasses/1526428800000/8/132/86')
            .end((err, res) => {
              res.headers.location.should.equal('/login');
              done();
            });
        });
      });

      describe('Logged in admin', () => {
        it('should return a 501 response for an unknown data type', (done) => {
          authenticatedAdmin.get('/api/fire/1526428800000/8/132/86')
            .end((err, res) => {
              res.statusCode.should.equal(501);
              done();
            });
        });
      });

      describe('Logged in user', () => {
        it('should return a 501 response for an unknown data type', (done) => {
          authenticatedUser.get('/api/fire/1526428800000/8/132/86')
            .end((err, res) => {
              res.statusCode.should.equal(501);
              done();
            });
        });
      });
    });

    describe('GET /gasses/:dateTime/:z/:x/:y', () => {
      describe('Not logged in', () => {
        it('should redirect to /login', (done) => {
          request(app).get('/api/gasses/1526428800000/8/132/86')
            .end((err, res) => {
              res.headers.location.should.equal('/login');
              done();
            });
        });

        it('should return a 302 response', (done) => {
          request(app).get('/api/gasses/1526428800000/8/132/86')
            .end((err, res) => {
              res.statusCode.should.equal(302);
              done();
            });
        });
      });

      describe('Logged in admin', () => {
        it('should create any missing folder(s)', (done) => {
          deleteFolderRecursive(path.resolve(cacheFolder, 'gasses'));

          authenticatedAdmin.get('/api/gasses/1526428800000/8/132/86')
            .end((err, res) => {
              res.statusCode.should.equal(200);
              done();
            });
        });

        it('should return a 200 response for /api/gasses/1526428800000/8/132/86', (done) => {
          deleteFolderRecursive(path.resolve(cacheFolder, 'gasses'));

          authenticatedAdmin.get('/api/gasses/1526428800000/8/132/86')
            .end((err, res) => {
              res.statusCode.should.equal(200);
              done();
            });
        });

        it('should return cached copy of /api/gasses/1526428800000/8/132/86', (done) => {
          authenticatedAdmin.get('/api/gasses/1526428800000/8/132/86')
            .end((err, res) => {
            // TODO: res.statusCode.should.equal(304);
              res.statusCode.should.equal(200);
              done();
            });
        });
      });

      describe('Logged in admin', () => {
        it('should create any missing folder(s)', (done) => {
          deleteFolderRecursive(path.resolve(cacheFolder, 'gasses'));

          authenticatedUser.get('/api/gasses/1526428800000/8/132/86')
            .end((err, res) => {
              res.statusCode.should.equal(200);
              done();
            });
        });

        it('should return a 200 response for /api/gasses/1526428800000/8/132/86', (done) => {
          deleteFolderRecursive(path.resolve(cacheFolder, 'gasses'));

          authenticatedUser.get('/api/gasses/1526428800000/8/132/86')
            .end((err, res) => {
              res.statusCode.should.equal(200);
              done();
            });
        });

        it('should return a cached copy of /api/gasses/1526428800000/8/132/86', (done) => {
          authenticatedUser.get('/api/gasses/1526428800000/8/132/86')
            .end((err, res) => {
            // TODO: res.statusCode.should.equal(304);
              res.statusCode.should.equal(200);
              done();
            });
        });
      });
    });

    describe('GET /light/:dateTime/:z/:x/:y', () => {
      describe('Not logged in', () => {
        it('should redirect to /login', (done) => {
          request(app).get('/api/light/1526428800000/8/132/86')
            .end((err, res) => {
              res.headers.location.should.equal('/login');
              done();
            });
        });

        it('should return a 302 response', (done) => {
          request(app).get('/api/light/1526428800000/8/132/86')
            .end((err, res) => {
              res.statusCode.should.equal(302);
              done();
            });
        });
      });

      describe('Logged in admin', () => {
        it('should create any missing folder(s)', (done) => {
          deleteFolderRecursive(path.resolve(cacheFolder, 'light'));

          authenticatedAdmin.get('/api/light/1526428800000/8/132/86')
            .end((err, res) => {
              res.statusCode.should.equal(200);
              done();
            });
        });

        it('should return a 200 response for /api/light/1526428800000/8/132/86', (done) => {
          deleteFolderRecursive(path.resolve(cacheFolder, 'light'));

          authenticatedAdmin.get('/api/light/1526428800000/8/132/86')
            .end((err, res) => {
              res.statusCode.should.equal(200);
              done();
            });
        });

        it('should return cached copy of /api/light/1526428800000/8/132/86', (done) => {
          authenticatedAdmin.get('/api/light/1526428800000/8/132/86')
            .end((err, res) => {
            // TODO: res.statusCode.should.equal(304);
              res.statusCode.should.equal(200);
              done();
            });
        });
      });

      describe('Logged in admin', () => {
        it('should create any missing folder(s)', (done) => {
          deleteFolderRecursive(path.resolve(cacheFolder, 'gasses'));

          authenticatedUser.get('/api/light/1526428800000/8/132/86')
            .end((err, res) => {
              res.statusCode.should.equal(200);
              done();
            });
        });

        it('should return a 200 response for /api/light/1526428800000/8/132/86', (done) => {
          deleteFolderRecursive(path.resolve(cacheFolder, 'light'));

          authenticatedUser.get('/api/light/1526428800000/8/132/86')
            .end((err, res) => {
              res.statusCode.should.equal(200);
              done();
            });
        });

        it('should return a cached copy of /api/light/1526428800000/8/132/86', (done) => {
          authenticatedUser.get('/api/light/1526428800000/8/132/86')
            .end((err, res) => {
            // TODO: res.statusCode.should.equal(304);
              res.statusCode.should.equal(200);
              done();
            });
        });
      });
    });

    describe('GET /temperature/:dateTime/:z/:x/:y', () => {
      describe('Not logged in', () => {
        it('should redirect to /login', (done) => {
          request(app).get('/api/temperature/1526428800000/8/132/86')
            .end((err, res) => {
              res.headers.location.should.equal('/login');
              done();
            });
        });

        it('should return a 302 response', (done) => {
          request(app).get('/api/temperature/1526428800000/8/132/86')
            .end((err, res) => {
              res.statusCode.should.equal(302);
              done();
            });
        });
      });

      describe('Logged in admin', () => {
        it('should create any missing folder(s)', (done) => {
          deleteFolderRecursive(path.resolve(cacheFolder, 'temperature'));

          authenticatedAdmin.get('/api/temperature/1526428800000/8/132/86')
            .end((err, res) => {
              res.statusCode.should.equal(200);
              done();
            });
        });

        it('should return a 200 response for /api/temperature/1526428800000/8/132/86', (done) => {
          deleteFolderRecursive(path.resolve(cacheFolder, 'temperature'));

          authenticatedAdmin.get('/api/temperature/1526428800000/8/132/86')
            .end((err, res) => {
              res.statusCode.should.equal(200);
              done();
            });
        });

        it('should return cached copy of /api/temperature/1526428800000/8/132/86', (done) => {
          authenticatedAdmin.get('/api/temperature/1526428800000/8/132/86')
            .end((err, res) => {
            // TODO: res.statusCode.should.equal(304);
              res.statusCode.should.equal(200);
              done();
            });
        });
      });

      describe('Logged in admin', () => {
        it('should create any missing folder(s)', (done) => {
          deleteFolderRecursive(path.resolve(cacheFolder, 'temperature'));

          authenticatedUser.get('/api/temperature/1526428800000/8/132/86')
            .end((err, res) => {
              res.statusCode.should.equal(200);
              done();
            });
        });

        it('should return a 200 response for /api/temperature/1526428800000/8/132/86', (done) => {
          deleteFolderRecursive(path.resolve(cacheFolder, 'temperature'));

          authenticatedUser.get('/api/temperature/1526428800000/8/132/86')
            .end((err, res) => {
              res.statusCode.should.equal(200);
              done();
            });
        });

        it('should return a cached copy of /api/temperature/1526428800000/8/132/86', (done) => {
          authenticatedUser.get('/api/temperature/1526428800000/8/132/86')
            .end((err, res) => {
            // TODO: res.statusCode.should.equal(304);
              res.statusCode.should.equal(200);
              done();
            });
        });
      });
    });
  });

  describe('GET /mapbox/:z/:x/:y', () => {
    describe('Not logged in', () => {
      it('should redirect to /login', (done) => {
        request(app).get('/api/mapbox/8/132/86')
          .end((err, res) => {
            res.headers.location.should.equal('/login');
            done();
          });
      });

      it('should return a 302 response', (done) => {
        request(app).get('/api/mapbox/8/132/86')
          .end((err, res) => {
            res.statusCode.should.equal(302);
            done();
          });
      });
    });

    describe('Logged in admin', () => {
      it('should create any missing folder(s)', (done) => {
        deleteFolderRecursive(path.resolve(cacheFolder, 'mapbox'));

        authenticatedAdmin.get('/api/mapbox/8/132/86')
          .end((err, res) => {
            res.statusCode.should.equal(200);
            done();
          });
      });

      it('should return a 200 response for /api/mapbox/8/132/86', (done) => {
        deleteFolderRecursive(path.resolve(cacheFolder, 'mapbox'));

        authenticatedAdmin.get('/api/mapbox/8/132/86')
          .end((err, res) => {
            res.statusCode.should.equal(200);
            done();
          });
      });

      it('should return a cached copy of /api/mapbox/8/132/86', (done) => {
        authenticatedAdmin.get('/api/mapbox/8/132/86')
          .end((err, res) => {
            // TODO: res.statusCode.should.equal(304);
            res.statusCode.should.equal(200);
            done();
          });
      });
    });

    describe('Logged in admin', () => {
      it('should create any missing folder(s)', (done) => {
        deleteFolderRecursive(path.resolve(cacheFolder, 'mapbox'));

        authenticatedUser.get('/api/mapbox/8/132/86')
          .end((err, res) => {
            res.statusCode.should.equal(200);
            done();
          });
      });

      it('should return a 200 response for /api/mapbox/8/132/86', (done) => {
        deleteFolderRecursive(path.resolve(cacheFolder, 'mapbox'));

        authenticatedUser.get('/api/mapbox/8/132/86')
          .end((err, res) => {
            res.statusCode.should.equal(200);
            done();
          });
      });

      it('should return a cached copy of /api/mapbox/8/132/86', (done) => {
        authenticatedUser.get('/api/mapbox/8/132/86')
          .end((err, res) => {
            // TODO: res.statusCode.should.equal(304);
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

      it('should return a 302 response', (done) => {
        request(app).get('/api/sensorhubs')
          .end((err, res) => {
            res.statusCode.should.equal(302);
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

  describe('GET /planet/:datetime/:z/:x/:y', () => {
    describe('Not logged in', () => {
      it('should redirect to /login', (done) => {
        request(app).get('/api/planet/1514764800000/8/132/86')
          .end((err, res) => {
            res.headers.location.should.equal('/login');
            done();
          });
      });

      it('should return a 302 response', (done) => {
        request(app).get('/api/planet/1514764800000/8/132/86')
          .end((err, res) => {
            res.statusCode.should.equal(302);
            done();
          });
      });
    });

    describe('Logged in admin', () => {
      it('should create any missing folder(s)', (done) => {
        deleteFolderRecursive(path.resolve(cacheFolder, 'planet'));

        authenticatedAdmin.get('/api/planet/1514764800000/8/132/86')
          .end((err, res) => {
            res.statusCode.should.equal(200);
            done();
          });
      }).timeout(5000);

      it('should return a 200 response for /api/planet/1514764800000/8/132/86', (done) => {
        deleteFolderRecursive(path.resolve(cacheFolder, 'planet'));

        authenticatedAdmin.get('/api/planet/1514764800000/8/132/86')
          .end((err, res) => {
            res.statusCode.should.equal(200);
            done();
          });
      }).timeout(5000);

      it('should return a cached copy of /api/planet/1514764800000/8/132/86', (done) => {
        authenticatedAdmin.get('/api/planet/1514764800000/8/132/86')
          .end((err, res) => {
            // TODO: res.statusCode.should.equal(304);
            res.statusCode.should.equal(200);
            done();
          });
      });

      it('should return a 500 response for future dates', (done) => {
        authenticatedAdmin.get('/api/planet/1546300800000/8/132/86')
          .end((err, res) => {
            res.statusCode.should.equal(500);
            done();
          });
      });

      it('should correct the month', (done) => {
        authenticatedAdmin.get('/api/planet/1512086400000/8/132/86')
          .end((err, res) => {
            res.statusCode.should.equal(200);
            done();
          });
      });

      it('should correct the month', (done) => {
        authenticatedAdmin.get('/api/planet/1525132800000/8/132/86')
          .end((err, res) => {
            res.statusCode.should.equal(200);
            done();
          });
      });
    });

    describe('Logged in user', () => {
      it('should create any missing folder(s)', (done) => {
        deleteFolderRecursive(path.resolve(cacheFolder, 'planet'));

        authenticatedUser.get('/api/planet/1514764800000/8/132/86')
          .end((err, res) => {
            res.statusCode.should.equal(200);
            done();
          });
      }).timeout(5000);

      it('should return a 200 response for /api/planet/1514764800000/8/132/86', (done) => {
        deleteFolderRecursive(path.resolve(cacheFolder, 'planet'));

        authenticatedUser.get('/api/planet/1514764800000/8/132/86')
          .end((err, res) => {
            res.statusCode.should.equal(200);
            done();
          });
      }).timeout(5000);

      it('should return a cached copy of /api/planet/1514764800000/8/132/86', (done) => {
        authenticatedUser.get('/api/planet/1514764800000/8/132/86')
          .end((err, res) => {
            // TODO: res.statusCode.should.equal(304);
            res.statusCode.should.equal(200);
            done();
          });
      });

      it('should return a 500 response for future dates', (done) => {
        authenticatedUser.get('/api/planet/1546300800000/8/132/86')
          .end((err, res) => {
            res.statusCode.should.equal(500);
            done();
          });
      });

      it('should correct the month', (done) => {
        authenticatedUser.get('/api/planet/1512086400000/8/132/86')
          .end((err, res) => {
            res.statusCode.should.equal(200);
            done();
          });
      });

      it('should correct the month', (done) => {
        authenticatedUser.get('/api/planet/1525132800000/8/132/86')
          .end((err, res) => {
            res.statusCode.should.equal(200);
            done();
          });
      });
    });
  });

  describe('GET /:host/:z/:x/:y', () => {
    describe('Not logged in', () => {
      it('should redirect to /login', (done) => {
        request(app).get('/api/asdf/1/2/3')
          .end((err, res) => {
            res.headers.location.should.equal('/login');
            done();
          });
      });

      it('should return a 302 response', (done) => {
        request(app).get('/api/asdf/1/2/3')
          .end((err, res) => {
            res.statusCode.should.equal(302);
            done();
          });
      });
    });
    describe('Logged in admin', () => {
      it('should return a 404 response', (done) => {
        authenticatedAdmin.get('/api/asdf/1/2/3')
          .end((err, res) => {
            res.statusCode.should.equal(404);
            done();
          });
      });
    });

    describe('Logged in user', () => {
      it('should return a 404 response', (done) => {
        authenticatedUser.get('/api/asdf/1/2/3')
          .end((err, res) => {
            res.statusCode.should.equal(404);
            done();
          });
      });
    });
  });
};
