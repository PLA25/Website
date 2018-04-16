/**
 * @see module:lib
 * @module lib/helpers
 */

/* Packages */
const fs = require('fs');
const request = require('request');

/**
 * Downloads an image from the given URL and saves it to the specified location.
 *
 * @function
 * @param {string} imageURL - URL of the image to download.
 * @param {string} localPath - Absolute path of the location to save to.
 * @returns {string} Path of the saved image.
 */
function downloadImage(imageURL, localPath) {
  return new Promise((resolve, reject) => {
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
