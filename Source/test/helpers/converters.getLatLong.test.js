/* Packages */
const chai = require('chai');

/* Lib */
const {
  getLatLong,
} = require('./../../helpers/converters');

chai.should();

module.exports = () => {
  // Arrange
  let latLong;

  const input = {
    z: 1,
    x: 1,
    y: 1,
  };

  describe('Output', () => {
    it('should return an array', () => {
      // Act
      latLong = getLatLong(input);

      // Assert
      latLong.should.be.a('array');
    });

    it('should return an array, with a length of 3', () => {
      // Act
      latLong = getLatLong(input);

      // Assert
      latLong.should.have.lengthOf(2);
    });

    it('should return an array, wit each member being a number', () => {
      // Act
      latLong = getLatLong(input);

      // Assert
      latLong[0].should.be.a('number');
      latLong[1].should.be.a('number');
    });
  });

  describe('Expected errors', () => {
    it('should return an error when \'z\' is not a number', () => {
      try {
        // Act
        latLong = getLatLong({
          z: 'invalid input',
          x: 1,
          y: 1,
        });
      } catch (err) {
        // Assert
        err.should.be.an.instanceOf(Error);
        err.should.have.property('message', 'Expected \'z\' to be a number!');
      }
    });

    it('should return an error when \'x\' is not a number', () => {
      try {
        // Act
        latLong = getLatLong({
          z: 1,
          x: 'invalid input',
          y: 1,
        });
      } catch (err) {
        // Assert
        err.should.be.an.instanceOf(Error);
        err.should.have.property('message', 'Expected \'x\' to be a number!');
      }
    });

    it('should return an error when \'y\' is not a number', () => {
      try {
        // Act
        latLong = getLatLong({
          z: 1,
          x: 1,
          y: 'invalid input',
        });
      } catch (err) {
        // Assert
        err.should.be.an.instanceOf(Error);
        err.should.have.property('message', 'Expected \'y\' to be a number!');
      }
    });
  });

  describe('Test cases', () => {
    // TODO: Test cases
  });
};
