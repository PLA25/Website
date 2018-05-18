/* Packages */
const chai = require('chai');

/* Lib */
const {
  getIncrement,
} = require('./../../helpers/converters');

chai.should();

module.exports = () => {
  // Arrange
  let increment;

  describe('Output', () => {
    it('should return a number', () => {
      // Act
      increment = getIncrement(0);

      // Assert
      increment.should.be.a('number');
    });
  });

  describe('Expected errors', () => {
    it('should return an error when the input is not a number', () => {
      try {
        // Act
        increment = getIncrement('invalid input');
      } catch (err) {
        // Assert
        err.should.be.an.instanceOf(Error);
        err.should.have.property('message', 'Expected \'z\' to be a number!');
      }
    });
  });

  describe('Test cases', () => {
    it('should return 128 with 7', () => {
      // Act
      increment = getIncrement(7);

      // Assert
      increment.should.equal(128);
    });

    it('should return 128 with 8', () => {
      // Act
      increment = getIncrement(8);

      // Assert
      increment.should.equal(128);
    });

    it('should return 64 with 9', () => {
      // Act
      increment = getIncrement(9);

      // Assert
      increment.should.equal(64);
    });

    it('should return 32 with 10', () => {
      // Act
      increment = getIncrement(10);

      // Assert
      increment.should.equal(32);
    });

    it('should return 16 with 11', () => {
      // Act
      increment = getIncrement(11);

      // Assert
      increment.should.equal(16);
    });

    it('should return 8 with 12', () => {
      // Act
      increment = getIncrement(12);

      // Assert
      increment.should.equal(8);
    });

    it('should return 8 with 13', () => {
      // Act
      increment = getIncrement(13);

      // Assert
      increment.should.equal(8);
    });
  });
};
