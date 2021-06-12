/*
 * Library for storing and editing data
 */


// Dependencies
const fs = require('fs');
const path = require('path');
const helpers = require("./helpers");

// Container for the module (to be exported)
const lib = {};

// Base directory of the data folder
lib.baseDir = path.join(__dirname, '/../.data/');

lib.create = function (dir, file, data, callback) {
  // open file for writing
  fs.open(`${lib.baseDir}${dir}/${file}.json`, 'wx', (err, fileDescriptor) => {
    if (!err) {
      // convert data to string
      const stringData = JSON.stringify(data);

      // write to file and close it
      fs.writeFile(fileDescriptor, stringData, (err) => {
        if (!err) {
          fs.close(fileDescriptor, (err) => {
            if (!err) {
              callback(false);
            } else {
              callback("Error closing new file");
            }
          });
        } else {
          callback("Error writing to new file");
        }
      });
    } else {
      callback("Could not create new file, it already exist");
    }
  });
}

// read data from the file
lib.read = function (dir, file, callback) {
  fs.readFile(`${lib.baseDir}${dir}/${file}.json`, "utf8", (err, data) => {
    if (!err) {
      callback(false, helpers.parseJsonToObject(data));
    } else {
      callback(err, data);
    }
  });
}

// update data of the file
lib.update = function (dir, file, data, callback) {
  // open the file for writing
  fs.open(`${lib.baseDir}${dir}/${file}.json`, 'r+', (err, fileDescriptor) => {
    if (!err) {
      const stringData = JSON.stringify(data);

      fs.ftruncate(fileDescriptor, (err) => {
        if (!err) {
          fs.writeFile(fileDescriptor, stringData, (err) => {
            if (!err) {
              fs.close(fileDescriptor, (err) => {
                if (!err) {
                  callback(false);
                } else callback("Error while closing the file");
              });
            } else callback("Error writing to existing file");
          });
        } else callback("Error truncating file");
      });
    } else callback("could not open the file for update - it may not exist yet.");
  });
}

// deleting a file
lib.delete = function (dir, file, callback) {
  // Unlink
  fs.unlink(`${lib.baseDir}${dir}/${file}.json`, (err) => {
    if (!err) {
      callback(false);
    } else callback("Could not delete file");
  });
}

// Export the module
module.exports = lib;
