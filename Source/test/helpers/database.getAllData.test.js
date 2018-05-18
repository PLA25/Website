/* Packages */
const chai = require('chai');

/* Lib */
const {
  getAllData,
} = require('./../../helpers/database');

chai.should();

module.exports = () => {
  describe('Output', () => {
    it('should return an object and an array', (done) => {
      // Act
      getAllData('Paris', 365)
        .then(([sensorHub, data]) => {
          // Assert
          sensorHub.should.be.a('object');
          data.should.be.a('array');

          done();
        });
    });
  });

  describe('Expected errors', () => {
    it('should return an error when \'serialID\' is not a string', (done) => {
      // Act
      getAllData(12345, 365)
        .catch((err) => {
          // Assert
          err.should.be.an.instanceOf(Error);
          err.should.have.property('message', 'Expected \'serialID\' to be a string!');

          done();
        });
    });

    it('should return an error when \'numberOfDays\' is not a number', (done) => {
      // Act
      getAllData('Amsterdam', 'Groningen')
        .catch((err) => {
          // Assert
          err.should.be.an.instanceOf(Error);
          err.should.have.property('message', 'Expected \'numberOfDays\' to be a number!');

          done();
        });
    });

    it('should return an error when \'serialID\' is not found in the database', (done) => {
      // Act
      getAllData('Unknown SensorHub', 365)
        .catch((err) => {
          // Assert
          err.should.be.an.instanceOf(Error);
          err.should.have.property('message', 'Could not find SensorHub with ID: \'Unknown SensorHub\'!');

          done();
        });
    });
  });

  describe('Test cases', () => {
    it('should return the correct data for Paris', (done) => {
      // Act
      getAllData('Paris', 365)
        .then(([sensorHub]) => {
          /*
           * .then(([sensorHub, data]) => {
           */
          // Assert
          sensorHub.Latitude.should.equal('48.856614');
          sensorHub.Longitude.should.equal('2.352222');
          /*
           * // Assert
           * data.should.have.length(1);
           * data[0].Type.should.equal('temperature');
           * data[0].Value.should.equal('20');
           */
          done();
        });
    });
  });
};
