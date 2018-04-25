/* Controllers */
const adminController = require('./controllers/admin.controller.test.js');
const apiController = require('./controllers/api.controller.test.js');
const homeController = require('./controllers/home.controller.test.js');

describe('Controllers', () => {
  describe('Admin Controller', adminController);

  describe('API Controller', apiController);

  describe('Home Controller', homeController);
});
