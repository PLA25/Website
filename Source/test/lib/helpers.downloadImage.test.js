/* Packages */
const fs = require('fs');
const path = require('path');
const chai = require('chai');

/* Lib */
const { downloadImage } = require('./../../lib/helpers');

chai.should();

module.exports = () => {
  // Arrange
  const url = 'https://a.tiles.mapbox.com/v3/planet.jh0b3oee/8/131/84.png';
  const imagePath = path.resolve(`${__dirname}./../../cache/mapbox/8_131_84.png`);
  const image = {
    host: 'mapbox',
    name: '8_131_84.png',
  };

  describe('Output', () => {
    it('should return a string', () => {
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

    it('should return an error if the url is invalid', () => {
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }

      // Act
      downloadImage('asdf', image)
        .catch((err) => {
          err.should.be.an.instanceOf(Error);
          err.should.have.property('message', 'Invalid URI "asdf"');
        });
    });

    it('should return an error if the file already exists', () => {
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }

      // Act
      downloadImage(url, image)
        .then(() => downloadImage(url, image))
        .catch((err) => {
          err.should.be.an.instanceOf(Error);
          err.should.have.property('message', 'File already exists!');
        });
    });
  });

  describe('Test cases', () => {
    it('mapbox 8_131_84', () => {
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
  });
};
