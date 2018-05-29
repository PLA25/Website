/* eslint-disable */

const config = require('./config/all');
const spawn = require('child_process').spawn;
const mongoose = require('mongoose');

const Data = require('./models/data');

const currentWeekNumber = require('current-week-number');

/* Connects to the MongoDB database with the configured settings. */
mongoose.connect(`mongodb://${config.MongoDB.User}:${config.MongoDB.Pass}@${config.MongoDB.Host}:${config.MongoDB.Port}/${config.MongoDB.Name}`);
mongoose.Promise = Promise;


let allData = [];
let x = 0;

let features = '[';
let labels = '[';
function trainData(index) {
    const dataNode = allData[index];
    const date = new Date(dataNode.Timestamp);

    let type = 0;
    if(dataNode.Type == 'temperature') {
        type = 0;
    } else if (dataNode.Type == 'gasses') {
        type = 1;
    } else {
        type = 2;
    }

    features += `[${date.getDay()-1}, ${currentWeekNumber(date)}, ${ date.getHours()-2}, ${type}, ${parseInt(dataNode.Value, 10)}],`;
    features += `[${date.getDay()-1}, ${currentWeekNumber(date)}, ${ date.getHours()-2}, ${type}, ${parseInt(dataNode.Value, 10)*0.75}],`;
    features += `[${date.getDay()-1}, ${currentWeekNumber(date)}, ${ date.getHours()-2}, ${type}, ${parseInt(dataNode.Value, 10)*1.25}],`;

    labels += '[1],';
    labels += '[0],';
    labels += '[0],';

    if ((index + 1) < allData.length) {
        setTimeout(() => { trainData(index + 1); });
    } else {
        const fs = require('fs');
        features += ']';
        labels += ']';

        fs.writeFile("./features.npy", JSON.stringify(features), (err) => {
            if (err) {
                console.error(err);
                return;
            };
            console.log("File has been created");
        });

        fs.writeFile("./labels.npy", JSON.stringify(labels), (err) => {
            if (err) {
                console.error(err);
                return;
            };
            console.log("File has been created");
        });
    }
}

for (let i = 0; i < 1; i++) {
    Data.find({}).exec()
        .then((data) => {
            allData = data;
            trainData(0);
        })
        .catch((err) => {
            console.error(err);
        });
}