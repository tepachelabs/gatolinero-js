/* eslint-disable global-require */
const path = require('path');
require('dotenv').config({
  path: path.join(__dirname, '../.env'),
});

const Logger = require('./utils/logger');

module.exports = (function onRun() {
  Logger.info('> Starting services');
  require('./discord');
}());
