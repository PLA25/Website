let config;
try {
  // eslint-disable-next-line global-require, import/no-unresolved
  config = require('./../config');
} catch (e) {
  config = {
    MongoDB: {
      Host: process.env.MongoDB_Host,
      Port: process.env.MongoDB_Port,
      User: process.env.MongoDB_User,
      Pass: process.env.MongoDB_Pass,
      Name: process.env.MongoDB_Name,
    },
  };
}

module.exports = config;
