/* Packages */
const chai = require('chai');

/* Lib */
const {
  subtractDays,
} = require('./../../helpers/converters');

chai.should();

module.exports = () => {
  // Arrange
  let date;

  describe('Output', () => {
    it('should return an instance of date', () => {
      // Act
      date = subtractDays(new Date(), 365);

      // Assert
      date.should.be.instanceOf(Date);
    });
  });

  describe('Expected errors', () => {
    it('should return an error when \'date\' is not an instance of Date', () => {
      try {
        // Act
        date = subtractDays('Invalid Input', 365);
      } catch (err) {
        // Assert
        err.should.be.an.instanceOf(Error);
        err.should.have.property('message', 'Expected \'date\' to be an instance of Date!');
      }
    });

    it('should return an error when \'numberOfDays\' is not a number', () => {
      try {
        // Act
        date = subtractDays(new Date(), 'Invalid Input');
      } catch (err) {
        // Assert
        err.should.be.an.instanceOf(Error);
        err.should.have.property('message', 'Expected \'numberOfDays\' to be a number!');
      }
    });
  });

  describe('Test cases', () => {
    it('should return 2017-01-01T00:00:00+00:00 with (2018-01-01T00:00:00+00:00, 365)', () => {
      // Act
      date = subtractDays(new Date(1514764800000), 365);

      // Assert
      date.should.deep.equal(new Date(1483228800000));
    });

    it('should return 2018-01-01T00:00:00+00:00 with (2018-01-01T00:00:00+00:00, 0)', () => {
      // Act
      date = subtractDays(new Date(1514764800000), 0);

      // Assert
      date.should.deep.equal(new Date(1514764800000));
    });

    it('should return 2019-01-01T00:00:00+00:00 with (2018-01-01T00:00:00+00:00, -365)', () => {
      // Act
      date = subtractDays(new Date(1514764800000), -365);

      // Assert
      date.should.deep.equal(new Date(1546300800000));
    });
  });
};
