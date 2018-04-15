/* Packages */
require('chai').should();

/* Lib */
const { tempToColor } = require('./../../lib');

describe('tempToColor', () => {
  // Arrange
  let color;

  it('should return an array', () => {
    // Act
    color = tempToColor(0);

    // Assert
    color.should.be.a('array');
  });

  it('should return an array, of type number', () => {
    // Act
    color = tempToColor(0);

    // Assert
    color[0].should.be.a('number');
    color[1].should.be.a('number');
    color[2].should.be.a('number');
  });

  it('should return an array, with a length of 3', () => {
    // Act
    color = tempToColor(0);

    // Assert
    color.should.have.lengthOf(3);
  });

  it('+   50°C should be [255,   0,   0]', () => {
    // Act
    color = tempToColor(50);

    // Assert
    color.should.deep.equal([255, 0, 0]);
  });

  it('+   25°C should be [127, 255,   0]', () => {
    // Act
    color = tempToColor(25);

    // Assert
    color.should.deep.equal([127, 255, 0]);
  });

  it('+ 12.5°C should be [  0, 255,  64]', () => {
    // Act
    color = tempToColor(12.5);

    // Assert
    color.should.deep.equal([0, 255, 64]);
  });

  it('±    0°C should be [  0, 255, 255]', () => {
    // Act
    color = tempToColor(0);

    // Assert
    color.should.deep.equal([0, 255, 255]);
  });

  it('- 12.5°C should be [  0,  64, 255]', () => {
    // Act
    color = tempToColor(-12.5);

    // Assert
    color.should.deep.equal([0, 64, 255]);
  });

  it('-   25°C should be [128,   0, 255]', () => {
    // Act
    color = tempToColor(-25);

    // Assert
    color.should.deep.equal([128, 0, 255]);
  });

  it('-   50°C should be [255,   0,   0]', () => {
    // Act
    color = tempToColor(-50);

    // Assert
    color.should.deep.equal([255, 0, 0]);
  });
});
