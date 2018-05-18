/* Packages */
const chai = require('chai');

/* Lib */
const {
  temperatureToDegrees,
} = require('./../../helpers/converters');

chai.should();

module.exports = () => {
  // Arrange
  let degrees;

  describe('Output', () => {
    it('should return a number', () => {
      // Act
      degrees = temperatureToDegrees(0);

      // Assert
      degrees.should.be.a('number');
    });
  });

  describe('Expected errors', () => {
    it('should return an error when \'temperature\' is not a number', () => {
      try {
        // Act
        degrees = temperatureToDegrees('invalid input');
      } catch (err) {
        // Assert
        err.should.be.an.instanceOf(Error);
        err.should.have.property('message', 'Expected \'temperature\' to be a number!');
      }
    });

    it('should return an error when \'temperature\' is not equal to or between -50°C and or 50°C', () => {
      try {
        // Act
        degrees = temperatureToDegrees(-51);
      } catch (err) {
        // Assert
        err.should.be.an.instanceOf(Error);
        err.should.have.property('message', 'Expected \'temperature\' to be equal to or between -50°C and or 50°C!');
      }
    });

    it('should return an error when \'temperature\' is not equal to or between -50°C and or 50°C', () => {
      try {
        // Act
        degrees = temperatureToDegrees(51);
      } catch (err) {
        // Assert
        err.should.be.an.instanceOf(Error);
        err.should.have.property('message', 'Expected \'temperature\' to be equal to or between -50°C and or 50°C!');
      }
    });
  });

  describe('Test cases', () => {
    it('should return 300° with -50°C', () => {
      // Act
      degrees = temperatureToDegrees(-50);

      // Assert
      degrees.should.deep.equal(300);
    });

    it('should return 225° with -25°C', () => {
      // Act
      degrees = temperatureToDegrees(-25);

      // Assert
      degrees.should.deep.equal(225);
    });

    it('should return 150° with   0°C', () => {
      // Act
      degrees = temperatureToDegrees(0);

      // Assert
      degrees.should.deep.equal(150);
    });

    it('should return  75° with  25°C', () => {
      // Act
      degrees = temperatureToDegrees(25);

      // Assert
      degrees.should.deep.equal(75);
    });

    it('should return   0° with  50°C', () => {
      // Act
      degrees = temperatureToDegrees(50);

      // Assert
      degrees.should.deep.equal(0);
    });
  });
};
