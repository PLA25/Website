/* Packages */
require('chai').should();

/* Lib */
const { tileToLat } = require('./../../lib/converter');

module.exports = () => {
  // Arrange
  let latitude;

  describe('Output', () => {
    it('should return a number', () => {
      // Act
      latitude = tileToLat(1, 1);

      // Assert
      latitude.should.be.a('number');
    });
  });

  describe('Test cases', () => {

  });
};
