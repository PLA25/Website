/* eslint-disable */

const config = require('./config/all');
const mongoose = require('mongoose');

const Data = require('./models/data');

const currentWeekNumber = require('current-week-number');

/* Connects to the MongoDB database with the configured settings. */
mongoose.connect(`mongodb://${config.MongoDB.User}:${config.MongoDB.Pass}@${config.MongoDB.Host}:${config.MongoDB.Port}/${config.MongoDB.Name}`);
mongoose.Promise = Promise;

const sensorhubs = ['\'s-Hertogenbosch', 'Arnhem', 'Assen', 'Den Haag', 'Den Helder', 'Groningen', 'Haarlem', 'Leeuwarden', 'Lelystad', 'Maastricht', 'Middelburg', 'Utrecht', 'Zwolle'];
const types = ['temperature', 'gasses', 'light'];

let x = 0;
for (let i = 0; i < sensorhubs.length; i++) {
  const sensorHub = sensorhubs[i];
  const baseDate = new Date(1526428800000); // 05/16/2018 @ 12:00am (UTC)

  for (let j = 0; j < 24 * 21; j++) {
    for (let t = 0; t < types.length; t++) {
      const type = types[t];
      const date = new Date(baseDate.getTime() + (j * 60 * 60 * 1000));

      const data = new Data();
      data.SensorHub = sensorHub;
      data.Timestamp = date;
      data.inMargin = 1;

      const hour = date.getHours() - 2;
      if (type == 'temperature') {
        data.Type = 'temperature';
        data.Value = Math.min(Math.max(-50, (50 * Math.sin(((2 * Math.PI) / 24) * (hour - (2 * Math.PI)))) * (1.5 - Math.random())), 50);
      } else if (type == 'gasses') {
        data.Type = 'gasses';
        data.Value = Math.min(Math.max(0, ((-50 * Math.sin(((2 * Math.PI) / 24) * (hour - (2 * Math.PI)))) + 50) * (1.5 - Math.random())), 100);
      } else {
        data.Type = 'light';
        data.Value = Math.min(Math.max(0, ((512 * Math.sin(((2 * Math.PI) / 24) * (hour - (2 * Math.PI)))) + 512) * (1.5 - Math.random())), 1024);
      }

      data.save()
        .then(() => {
          console.log(x++);
        })
        .catch((err) => {
          console.log(data);
          console.error(err);
        });
    }
  }
}

console.log('done');
