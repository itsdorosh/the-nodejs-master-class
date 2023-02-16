import crypto from 'crypto';
import { environmentToExport as config } from '../config.js';

export const helpers = {
  hash(str) {
    if (typeof (str) === 'string' && str.length > 0) {
      return crypto
        .createHmac('sha256', config.hashingSecret)
        .update(str)
        .digest('hex');
    }
    return null;
  },

  // Parse a JSON string to an object
  parseJsonToObject(buffer) {
    let obj = {};
    try {
      obj = JSON.parse(buffer);
    } catch (err) {
      return {};
    }

    return obj;
  },

  requiredParamValidator: (data, fieldName, validationParams = {
    type: 'string',
    minLength: 0,
    maxLength: Infinity,
    exactLength: 1
  }) => {
    let isValid = typeof (data.payload[fieldName]) === validationParams.type;
    let value = null;

    if (isValid) {
      switch (validationParams.type) {
        case 'string':
          value = data.payload[fieldName].trim();
          break;
        case 'number':
          value = +data.payload[fieldName];
          break;
        case 'boolean':
          value = !!data.payload[fieldName];
          break;
      }
    }

    if (isValid && validationParams.minLength) {
      isValid = data.payload[fieldName].trim().length >= validationParams.minLength;
    }

    if (isValid && validationParams.maxLength) {
      isValid = data.payload[fieldName].trim().length <= validationParams.maxLength;
    }

    if (isValid && validationParams.exactLength) {
      isValid = data.payload[fieldName].trim().length === validationParams.exactLength;
    }

    return isValid ? value : null;
  },
};
