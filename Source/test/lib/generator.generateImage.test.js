/* Packages */
require('chai').should();

/* Lib */
const { generateImage } = require('./../../lib/generator');

module.exports = () => {
  // Arrange
  let image;

  describe('Output', () => {
    it('should return an image of 256 by 256 pixels', () => {
      // Act
      image = generateImage({}, {}, {});

      // Assert
      image.bitmap.height.should.equal(256);
      image.bitmap.width.should.equal(256);
    });
  });

  describe('Test cases', () => {

  });
};
