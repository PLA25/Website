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
    Planet: {
      Key: process.env.Planet_Key,
    },
    Redis: {
      host: process.env.Redis_Host,
      port: process.env.Redis_Port,
      pass: process.env.Redis_Pass,
      db: 0,
    },
  };
}

module.exports = config;
