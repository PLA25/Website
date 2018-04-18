/* Packages */
const chai = require('chai');

/* Lib */
const { degreesToColor } = require('./../../helpers/converters');

chai.should();

module.exports = () => {
  // Arrange
  let color;

  describe('Output', () => {
    it('should return an array', () => {
      // Act
      color = degreesToColor(0);

      // Assert
      color.should.be.a('array');
    });

    it('should return an array, with a length of 3', () => {
      // Act
      color = degreesToColor(0);

      // Assert
      color.should.have.lengthOf(3);
    });

    it('should return an array, wit each member being a number', () => {
      // Act
      color = degreesToColor(0);

      // Assert
      color[0].should.be.a('number');
      color[1].should.be.a('number');
      color[2].should.be.a('number');
    });
  });

  describe('Expected errors', () => {
    it('should return an error when the input is not a number', () => {
      try {
        // Act
        color = degreesToColor('invalid input');
      } catch (err) {
        // Assert
        err.should.be.an.instanceOf(Error);
        err.should.have.property('message', 'Expected \'degrees\' to be a number!');
      }
    });

    it('should return an error when the input is below 0°', () => {
      try {
        // Act
        color = degreesToColor(-1);
      } catch (err) {
        // Assert
        err.should.be.an.instanceOf(Error);
        err.should.have.property('message', 'Expected \'degrees\' to be within 0 - 360!');
      }
    });

    it('should return an error when the input is above 360°', () => {
      try {
        // Act
        color = degreesToColor(361);
      } catch (err) {
        // Assert
        err.should.be.an.instanceOf(Error);
        err.should.have.property('message', 'Expected \'degrees\' to be within 0 - 360!');
      }
    });
  });

  describe('Test cases', () => {
    it('should return [255,   0,   0] with   0°', () => {
      // Act
      color = degreesToColor(0);

      // Assert
      color.should.deep.equal([255, 0, 0]);
    });

    it('should return [255, 255,   0] with  60°', () => {
      // Act
      color = degreesToColor(60);

      // Assert
      color.should.deep.equal([255, 255, 0]);
    });

    it('should return [  0, 255,   0] with 120°', () => {
      // Act
      color = degreesToColor(120);

      // Assert
      color.should.deep.equal([0, 255, 0]);
    });

    it('should return [  0, 255, 255] with 180°', () => {
      // Act
      color = degreesToColor(180);

      // Assert
      color.should.deep.equal([0, 255, 255]);
    });

    it('should return [  0,   0, 255] with 240°', () => {
      // Act
      color = degreesToColor(240);

      // Assert
      color.should.deep.equal([0, 0, 255]);
    });

    it('should return [255,   0, 255] with 300°', () => {
      // Act
      color = degreesToColor(300);

      // Assert
      color.should.deep.equal([255, 0, 255]);
    });

    it('should return [255,   0,   0] with 360°', () => {
      // Act
      color = degreesToColor(360);

      // Assert
      color.should.deep.equal([255, 0, 0]);
    });
  });
};
