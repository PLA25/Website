const { tempToDegrees } = require('./../lib/converter');
const expect = require('expect.js');

describe('tempToColor', () => {
  it(' 50°C should be equal to   0°', () => {
    expect(tempToDegrees(50)).to.equal(0);
  });
  it('-50°C should be equal to 300°', () => {
    expect(tempToDegrees(-50)).to.equal(300);
  });
  it('  0°C should be equal to 150°', () => {
    expect(tempToDegrees(0)).to.equal(150);
  });
});
