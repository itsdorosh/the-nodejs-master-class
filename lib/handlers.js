import {DataLibrary} from "./data-library";

const helpers = require('./helpers');

// Define a request router
export const handlers = {};

handlers._users = {};

// Required fields: phone
// Optional data: none
// @TODO: only let an authenticated users access their object
// @TODO: and prevent access to anyone's objects
handlers._users.get = (data, callback) => {
  const phone = data.queryStringObject.get('phone');
  const phoneValidated = (typeof (phone) === 'string' && phone.trim().length === 12) ? phone.trim() : null;

  if (phoneValidated) {
    DataLibrary.read('users', phoneValidated, (err, data) => {
      if (!err) {
        callback(200, {
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          tasAgreement: data.tasAgreement,
        });
      } else {
        callback(404, {'Error': "User not found"});
      }
    });
  } else {
    callback(400, {'Error': "Missing required fields"});
  }
};

// Required fields: firstName, lastName, phone, password, tasAgreement
// Optional data: none
handlers._users.post = (data, callback) => {
  // check that all required fields are filled out
  const firstName = helpers.requiredParamValidator(data, 'firstName', {
    type: 'string',
    minLength: 1
  });
  const lastName = helpers.requiredParamValidator(data, 'lastName', {
    type: 'string',
    minLength: 1
  });
  const phone = helpers.requiredParamValidator(data, 'phone', {
    type: 'string',
    exactLength: 12
  });
  const password = helpers.requiredParamValidator(data, 'password', {
    type: 'string',
    minLength: 1
  });
  const tasAgreement = helpers.requiredParamValidator(data, 'tasAgreement', {type: 'boolean'});

  if (firstName && lastName && phone && password && tasAgreement) {
    // Make sure that the user already exist
    DataLibrary.read('users', phone, (err) => {
      if (err) {
        // hash the password
        const hashPassword = helpers.hash(password);

        if (hashPassword) {
          const userObject = {
            firstName,
            lastName,
            phone,
            hashPassword,
            tasAgreement,
          };

          DataLibrary.create('users', phone, userObject, (err) => {
            if (!err) {
              callback(200);
            } else {
              console.error(err);
              callback(500, {'Error': 'Could not create the new user'});
            }
          });
        } else {
          callback(500, {'Error': 'Could not hash the user\'s password'});
        }
      } else {
        callback(400, {'Error': 'A user already exists'});
      }
    })

  } else {
    callback(400, {'Error': "Missing required fields"})
  }
};

// Required fields: phone
// Optional data: firstName, lastName, password (at least one must be specified)
// @TODO: only let an authenticated users update their object
handlers._users.put = (data, callback) => {
  const firstName = helpers.requiredParamValidator(data, 'firstName', {
    type: 'string',
    minLength: 1
  });
  const lastName = helpers.requiredParamValidator(data, 'lastName', {
    type: 'string',
    minLength: 1
  });
  const phone = helpers.requiredParamValidator(data, 'phone', {
    type: 'string',
    exactLength: 12
  });
  const password = helpers.requiredParamValidator(data, 'password', {
    type: 'string',
    minLength: 1
  });

  if (phone) {
    if (firstName || lastName || password) {
      DataLibrary.read('users', phone, (err, data) => {
        if (!err && data) {
          if (firstName) {
            data.firstName = firstName;
          }
          if (lastName) {
            data.lastName = lastName;
          }
          if (password) {
            data.hashedPassword = helpers.hash(password);
          }

          DataLibrary.update('users', phone, data, (err) => {
            if (!err) {
              callback(203);
            } else {
              console.error(err);
              callback(500, {'Error': 'Could not update the user data'});
            }
          });
        } else {
          callback(400, {'Error': 'A user doesn\'t exist'});
        }
      });
    } else {
      callback(400, {'Error': "One field at least should be specified"});
    }
  } else {
    callback(400, {'Error': "Missing required fields"});
  }
};

// Required fields: phone
// Optional data: none
// @TODO: only let an authenticated users delete their object
handlers._users.delete = (data, callback) => {
  const phone = data.queryStringObject.get('phone');
  const phoneValidated = (typeof (phone) === 'string' && phone.trim().length === 12) ? phone.trim() : null;

  if (phoneValidated) {
    DataLibrary.read('users', phoneValidated, (err) => {
      if (!err) {
        DataLibrary.delete('users', phoneValidated, (err) => {
          if (!err) {
            callback(200);
          } else {
            console.error(err);
            callback(500, {'Error': 'Could not delete the user'});
          }
        });
      } else {
        callback(404, {'Error': "User not found"});
      }
    });
  } else {
    callback(400, {'Error': "Missing required fields"});
  }
};

handlers.users = (data, callback) => {
  const acceptableMethods = ['get', 'post', 'put', 'delete'];
  if (acceptableMethods.includes(data.method)) {
    handlers._users[data.method](data, callback);
  } else {
    callback(405);
  }
};

handlers.ping = (data, callback) => callback(200);
handlers.notFound = (data, callback) => callback(404);
