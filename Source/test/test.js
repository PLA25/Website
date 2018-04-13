const { tempToDegrees } = require('./../lib/converter');
const expect = require('expect.js');

describe('tempToColor', () => {
  it('should return true', () => {
    expect(tempToDegrees(50)).to.equal(0);
  });
});
