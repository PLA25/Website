/* Packages */
const chai = require('chai');

/* Lib */
const {
  calculateDegrees,
} = require('./../../helpers/converters');

chai.should();

module.exports = () => {
  // Arrange
  let degrees;

  describe('Output', () => {
    it('should return a number', () => {
      // Act
      degrees = calculateDegrees(50, 0, 100);

      // Assert
      degrees.should.be.a('number');
    });
  });

  describe('Expected errors', () => {
    it('should return an error when \'input\' is not a number', () => {
      try {
        // Act
        degrees = calculateDegrees('invalid input', 0, 0);
      } catch (err) {
        // Assert
        err.should.be.an.instanceOf(Error);
        err.should.have.property('message', 'Expected \'input\' to be a number!');
      }
    });

    it('should return an error when \'min\' is not a number', () => {
      try {
        // Act
        degrees = calculateDegrees(0, 'invalid input', 0);
      } catch (err) {
        // Assert
        err.should.be.an.instanceOf(Error);
        err.should.have.property('message', 'Expected \'min\' to be a number!');
      }
    });

    it('should return an error when \'max\' is not a number', () => {
      try {
        // Act
        degrees = calculateDegrees(0, 0, 'invalid input');
      } catch (err) {
        // Assert
        err.should.be.an.instanceOf(Error);
        err.should.have.property('message', 'Expected \'max\' to be a number!');
      }
    });

    it('should return an error when \'input\' is not equal to or between \'min\' and or \'max\'', () => {
      try {
        // Act
        degrees = calculateDegrees(-1, 0, 100);
      } catch (err) {
        // Assert
        err.should.be.an.instanceOf(Error);
        err.should.have.property('message', 'Expected \'input\' to be equal to or between \'min\' and or \'max\'!');
      }
    });

    it('should return an error when \'input\' is not equal to or between \'min\' and or \'max\'', () => {
      try {
        // Act
        degrees = calculateDegrees(101, 0, 100);
      } catch (err) {
        // Assert
        err.should.be.an.instanceOf(Error);
        err.should.have.property('message', 'Expected \'input\' to be equal to or between \'min\' and or \'max\'!');
      }
    });
  });

  describe('Test cases', () => {
    it('should return   0° with (  0,    0,  100)', () => {
      // Act
      degrees = calculateDegrees(0, 0, 100);

      // Assert
      degrees.should.equal(0);
    });

    it('should return  90° with ( 25,    0,  100)', () => {
      // Act
      degrees = calculateDegrees(25, 0, 100);

      // Assert
      degrees.should.equal(90);
    });

    it('should return 180° with ( 50,    0,  100)', () => {
      // Act
      degrees = calculateDegrees(50, 0, 100);

      // Assert
      degrees.should.equal(180);
    });

    it('should return 270° with ( 75,    0,  100)', () => {
      // Act
      degrees = calculateDegrees(75, 0, 100);

      // Assert
      degrees.should.equal(270);
    });

    it('should return 360° with (100,    0,  100)', () => {
      // Act
      degrees = calculateDegrees(100, 0, 100);

      // Assert
      degrees.should.equal(360);
    });

    it('should return   0° with (-50,   -50,  50)', () => {
      // Act
      degrees = calculateDegrees(-50, -50, 50);

      // Assert
      degrees.should.equal(0);
    });

    it('should return  90° with (-25,   -50,  50)', () => {
      // Act
      degrees = calculateDegrees(-25, -50, 50);

      // Assert
      degrees.should.equal(90);
    });

    it('should return 180° with (  0,   -50,  50)', () => {
      // Act
      degrees = calculateDegrees(0, -50, 50);

      // Assert
      degrees.should.equal(180);
    });

    it('should return 270° with ( 25,   -50,  50)', () => {
      // Act
      degrees = calculateDegrees(25, -50, 50);

      // Assert
      degrees.should.equal(270);
    });

    it('should return 360° with ( 50,   -50,  50)', () => {
      // Act
      degrees = calculateDegrees(50, -50, 50);

      // Assert
      degrees.should.equal(360);
    });
  });
};
