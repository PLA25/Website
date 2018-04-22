/* Controllers */
const apiController = require('./controllers/api.controller.test.js');
const homeController = require('./controllers/home.controller.test.js');

describe('Controllers', () => {
  describe('API Controller', apiController);

  describe('Home Controller', homeController);
});
