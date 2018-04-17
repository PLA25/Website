/* Packages */
const chai = require('chai');

/* Lib */
const { tileToLat } = require('./../../helpers/converters');

chai.should();

module.exports = () => {
  // Arrange
  let latitude;

  describe('Output', () => {
    it('should return a number', () => {
      // Act
      latitude = tileToLat(0, 0);

      // Assert
      latitude.should.be.a('number');
    });
  });

  describe('Expected errors', () => {
    it('should return an error when \'y\' is not a number', () => {
      try {
        // Act
        latitude = tileToLat('invalid input', 0);
      } catch (err) {
        // Assert
        err.should.be.an.instanceOf(Error);
        err.should.have.property('message', 'Expected \'y\' to be a number!');
      }
    });

    it('should return an error when \'z\' is not a number', () => {
      try {
        // Act
        latitude = tileToLat(0, 'invalid input');
      } catch (err) {
        // Assert
        err.should.be.an.instanceOf(Error);
        err.should.have.property('message', 'Expected \'z\' to be a number!');
      }
    });
  });

  describe('Test cases', () => {
  });
};
