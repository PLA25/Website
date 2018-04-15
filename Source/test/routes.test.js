/* Tests */
const admin = require('./routes/admin.test');
const api = require('./routes/api.test');
const map = require('./routes/map.test');

/* Routest tests */
describe('Routes', () => {
  /* Admin tests */
  describe('GET /admin', admin);

  /* API tests */
  describe('GET /api', api);

  /* Map tests */
  describe('GET /map', map);
});
