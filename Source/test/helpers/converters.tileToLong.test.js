/* Packages */
const chai = require('chai');

/* Lib */
const { tileToLong } = require('./../../helpers/converters');

chai.should();

module.exports = () => {
  // Arrange
  let longitude;

  describe('Output', () => {
    it('should return a number', () => {
      // Act
      longitude = tileToLong(0, 0);

      // Assert
      longitude.should.be.a('number');
    });
  });

  describe('Expected errors', () => {
    it('should return an error when \'x\' is not a number', () => {
      try {
        // Act
        longitude = tileToLong('invalid input', 0);
      } catch (err) {
        // Assert
        err.should.be.an.instanceOf(Error);
        err.should.have.property('message', 'Expected \'x\' to be a number!');
      }
    });

    it('should return an error when \'z\' is not a number', () => {
      try {
        // Act
        longitude = tileToLong(0, 'invalid input');
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
