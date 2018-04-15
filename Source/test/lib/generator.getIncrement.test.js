/* Packages */
require('chai').should();

/* Lib */
const { getIncrement } = require('./../../lib/generator');

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

    it('should range between 8 and 128', () => {
      // Act
      increment = getIncrement(Number.MIN_SAFE_INTEGER);

      // Assert
      increment.should.be.within(8, 128);

      // Act
      increment = getIncrement(Number.MAX_SAFE_INTEGER);

      // Assert
      increment.should.be.within(8, 128);
    });
  });

  describe('Test cases', () => {
    it('zoom  7 should equal 2^7', () => {
      // Act
      increment = getIncrement(7);

      // Assert
      increment.should.equal(2 ** 7);
    });

    it('zoom  8 should equal 2^7', () => {
      // Act
      increment = getIncrement(8);

      // Assert
      increment.should.equal(2 ** 7);
    });

    it('zoom  9 should equal 2^6', () => {
      // Act
      increment = getIncrement(9);

      // Assert
      increment.should.equal(2 ** 6);
    });

    it('zoom 10 should equal 2^5', () => {
      // Act
      increment = getIncrement(10);

      // Assert
      increment.should.equal(2 ** 5);
    });

    it('zoom 11 should equal 2^4', () => {
      // Act
      increment = getIncrement(11);

      // Assert
      increment.should.equal(2 ** 4);
    });

    it('zoom 12 should equal 2^3', () => {
      // Act
      increment = getIncrement(12);

      // Assert
      increment.should.equal(2 ** 3);
    });

    it('zoom 13 should equal 2^3', () => {
      // Act
      increment = getIncrement(13);

      // Assert
      increment.should.equal(2 ** 3);
    });

    it('zoom 14 should equal 2^3', () => {
      // Act
      increment = getIncrement(14);

      // Assert
      increment.should.equal(2 ** 3);
    });

    it('zoom 15 should equal 2^3', () => {
      // Act
      increment = getIncrement(15);

      // Assert
      increment.should.equal(2 ** 3);
    });
  });
};
