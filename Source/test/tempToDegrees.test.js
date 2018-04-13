/* Packages */
require('chai').should();

/* Lib */
const { tempToDegrees } = require('./../lib/converter');

describe('tempToDegrees', () => {
  // Arrange
  let degrees;

  it('should return a number', () => {
    // Act
    degrees = tempToDegrees(0);

    // Assert
    degrees.should.be.a('number');
  });

  it(' 50°C should be equal to   0°', () => {
    // Act
    degrees = tempToDegrees(50);

    // Assert
    degrees.should.equal(0);
  });

  it('  0°C should be equal to 150°', () => {
    // Act
    degrees = tempToDegrees(0);

    // Assert
    degrees.should.equal(150);
  });

  it('-50°C should be equal to 300°', () => {
    // Act
    degrees = tempToDegrees(-50);

    // Assert
    degrees.should.equal(300);
  });
});
