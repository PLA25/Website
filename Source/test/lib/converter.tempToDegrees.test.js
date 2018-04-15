/* Packages */
require('chai').should();

/* Lib */
const { tempToDegrees } = require('./../../lib');

describe('tempToDegrees', () => {
  // Arrange
  let degrees;

  it('should return a number', () => {
    // Act
    degrees = tempToDegrees(0);

    // Assert
    degrees.should.be.a('number');
  });

  it('+ 100°C should be equal to 180°', () => {
    // Act
    degrees = tempToDegrees(100);

    // Assert
    degrees.should.equal(180);
  });

  it('+  50°C should be equal to   0°', () => {
    // Act
    degrees = tempToDegrees(50);

    // Assert
    degrees.should.equal(0);
  });

  it('+  25°C should be equal to  90°', () => {
    // Act
    degrees = tempToDegrees(25);

    // Assert
    degrees.should.equal(90);
  });

  it('±   0°C should be equal to 180°', () => {
    // Act
    degrees = tempToDegrees(0);

    // Assert
    degrees.should.equal(180);
  });

  it('-  25°C should be equal to 270°', () => {
    // Act
    degrees = tempToDegrees(-25);

    // Assert
    degrees.should.equal(270);
  });

  it('-  50°C should be equal to 360°', () => {
    // Act
    degrees = tempToDegrees(-50);

    // Assert
    degrees.should.equal(360);
  });

  it('- 100°C should be equal to 180°', () => {
    // Act
    degrees = tempToDegrees(-100);

    // Assert
    degrees.should.equal(180);
  });
});
