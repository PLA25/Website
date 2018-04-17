/**
 * @see module:lib
 * @module lib/helpers
 */

/* Packages */
const fs = require('fs');
const path = require('path');
const request = require('request');

/**
 * Downloads an image from the given URL and saves it to the specified location.
 *
 * @function
 * @param {string} imageURL - URL of the image to download.
 * @param {string} localPath - Absolute path of the location to save to.
 * @returns {string} Path of the saved image.
 */
function downloadImage(imageURL, { host, name }) {
  const cacheFolder = path.resolve(`${__dirname}./../cache/`);
  if (!fs.existsSync(cacheFolder)) {
    fs.mkdirSync(cacheFolder);
  }

  const hostFolder = path.resolve(cacheFolder, host);
  if (!fs.existsSync(hostFolder)) {
    fs.mkdirSync(hostFolder);
  }

  return new Promise((resolve, reject) => {
    const localPath = path.resolve(hostFolder, name);
    if (fs.existsSync(localPath)) {
      reject(new Error('File already exists!'));
      return;
    }

    request.head(imageURL, (err) => {
      if (err) {
        reject(err);
        return;
      }

      request(imageURL)
        .pipe(fs.createWriteStream(localPath))
        .on('close', () => {
          resolve(localPath);
        });
    });
  });
}

module.exports = {
  downloadImage,
};
