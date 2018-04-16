/* Packages */
require('chai').should();

/* Lib */
const { tileToLong } = require('./../../lib/converter');

module.exports = () => {
  // Arrange
  let longitude;

  describe('Output', () => {
    it('should return a number', () => {
      // Act
      longitude = tileToLong(1, 1);

      // Assert
      longitude.should.be.a('number');
    });
  });

  describe('Test cases', () => {

  });
};
