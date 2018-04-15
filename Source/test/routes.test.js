/* Routes */
const admin = require('./routes/admin.test');
const api = require('./routes/api.test');
const map = require('./routes/map.test');

describe('Routes', () => {
  describe('admin', admin);

  describe('api', api);

  describe('map', map);
});
