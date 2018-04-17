/* Packages */
const chai = require('chai');

/* Lib */
const { temperatureToColor } = require('./../../helpers/converters');

chai.should();

module.exports = () => {
  // Arrange
  let color;

  describe('Output', () => {
    it('should return an array', () => {
      // Act
      color = temperatureToColor(0);

      // Assert
      color.should.be.a('array');
    });

    it('should return an array, with a length of 3', () => {
      // Act
      color = temperatureToColor(0);

      // Assert
      color.should.have.lengthOf(3);
    });

    it('should return an array, wit each member being a number', () => {
      // Act
      color = temperatureToColor(0);

      // Assert
      color[0].should.be.a('number');
      color[1].should.be.a('number');
      color[2].should.be.a('number');
    });
  });

  describe('Expected errors', () => {
    it('should return an error when \'temperature\' is not a number', () => {
      try {
        // Act
        color = temperatureToColor('invalid input');
      } catch (err) {
        // Assert
        err.should.be.an.instanceOf(Error);
        err.should.have.property('message', 'Expected \'temperature\' to be a number!');
      }
    });

    it('should return an error when \'temperature\' is not equal to or between -50°C and or 50°C', () => {
      try {
        // Act
        color = temperatureToColor(-51);
      } catch (err) {
        // Assert
        err.should.be.an.instanceOf(Error);
        err.should.have.property('message', 'Expected \'temperature\' to be equal to or between -50°C and or 50°C!');
      }
    });

    it('should return an error when \'temperature\' is not equal to or between -50°C and or 50°C', () => {
      try {
        // Act
        color = temperatureToColor(51);
      } catch (err) {
        // Assert
        err.should.be.an.instanceOf(Error);
        err.should.have.property('message', 'Expected \'temperature\' to be equal to or between -50°C and or 50°C!');
      }
    });
  });

  describe('Test cases', () => {
    it('should return [255,   0, 255] with -50°C', () => {
      // Act
      color = temperatureToColor(-50);

      // Assert
      color.should.deep.equal([255, 0, 255]);
    });

    it('should return [  0,  64, 255] with -25°C', () => {
      // Act
      color = temperatureToColor(-25);

      // Assert
      color.should.deep.equal(([0, 64, 255]));
    });

    it('should return [  0, 255, 128] with   0°C', () => {
      // Act
      color = temperatureToColor(0);

      // Assert
      color.should.deep.equal([0, 255, 128]);
    });

    it('should return [191, 255,   0] with  25°C', () => {
      // Act
      color = temperatureToColor(25);

      // Assert
      color.should.deep.equal([191, 255, 0]);
    });

    it('should return [255,   0,   0] with  50°C', () => {
      // Act
      color = temperatureToColor(50);

      // Assert
      color.should.deep.equal([255, 0, 0]);
    });
  });
};
