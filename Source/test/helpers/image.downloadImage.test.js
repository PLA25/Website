/* Packages */
const chai = require('chai');
const fs = require('fs');
const isCI = require('is-ci');
const path = require('path');

/* Lib */
const { downloadImage } = require('./../../helpers/image');

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

  // Arrange
  const url = 'https://a.tiles.mapbox.com/v3/planet.jh0b3oee/8/131/84.png';
  const imagePath = path.resolve(cacheFolder, 'mapbox', '8_131_84.png');
  const image = {
    host: 'mapbox',
    name: '8_131_84.png',
  };

  describe('Output', () => {
    it('should return a string', () => {
      // Arrange
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }

      // Act
      downloadImage(url, image)
        .then((img) => {
          // Assert
          img.should.be.a('string');
        });
    });

    it('should create any missing folder(s)', () => {
      // Act
      downloadImage(url, image)
        .then((img) => {
          // Assert
          img.should.equal(imagePath);
        });
    });
  });

  describe('Expected errors', () => {
    it('should return an error if the url is invalid', () => {
      // Arrange
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }

      // Act
      downloadImage('invalid', image)
        .catch((err) => {
          // Assert
          err.should.be.an.instanceOf(Error);
          err.should.have.property('message', 'Invalid URI "invalid"');
        });
    });
  });

  describe('Test cases', () => {
    it('should download mapbox 8_131_84 to cache/mapbox/8_131_84.png', () => {
      // Arrange
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }

      // Act
      downloadImage(url, image)
        .then((img) => {
          // Assert
          fs.readFileSync(img).should.deep.equal(fs.readFileSync(path.resolve(`${__dirname}./../expected/mapbox_8_131_84.png`)));
        });
    });

    it('should give the previously downloaded mapbox 8_131_84', () => {
      // Arrange
      downloadImage(url, image)
        // Act
        .then(() => downloadImage(url, image))
        .then((img) => {
          // Assert
          fs.readFileSync(img).should.deep.equal(fs.readFileSync(path.resolve(`${__dirname}./../expected/mapbox_8_131_84.png`)));
        });
    });
  });
};
