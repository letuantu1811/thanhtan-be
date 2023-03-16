const messageJson = require('./message.json');
const _ = require('lodash');

const getMessage = (key = '') => {
  // Check empty key.
  if (_.isEmpty(key)) {
    return '';
  }
  let rootNode = messageJson.res;
  // get child keys.
  const keys = key.split('.');

  // Get result message data.
  let resultMessage = '';
  _.map(keys, (item) => {
    const valueOfKey = rootNode[item];
    if (_.isObject(valueOfKey)) {
      rootNode = valueOfKey;
    } else {
      if (_.isString(valueOfKey)) {
        resultMessage = valueOfKey;
      }
      if (_.isInteger(valueOfKey)) {
        resultMessage = valueOfKey;
      }
    }
  })
  return resultMessage;
};

const getMessageValidate = (key = '') => {
  // Check empty key.
  if (_.isEmpty(key)) {
    return '';
  }
  let rootNode = messageJson.validate;
  // get child keys.
  const keys = key.split('.');

  // Get result message data.
  let resultMessage = '';
  _.map(keys, (item) => {
    let param = item.includes('-')
    const valueOfKey = rootNode[param ? item.split('-')[0] : item];
    if (_.isObject(valueOfKey)) {
      rootNode = valueOfKey;
    } else {
      if (_.isString(item.split('-')[0])) {
        resultMessage = item.split('-')[1] +" "+ valueOfKey;
      }
    }
  })
  return resultMessage;
};

const success = (message, data) => {
  return {
    status: true,
    message: message,
    data: data
  }

}
const error = (message, code, data) => {
  return {
    status: false,
    code: code,
    message: message,
    data: data, 
    path: data.path
  }
}
module.exports = {
  getMessage,
  getMessageValidate,
  success,
  error
};