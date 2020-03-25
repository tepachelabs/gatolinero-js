/* eslint-disable global-require */
const path = require('path');
const Logger = require('./utils/logger');

require('dotenv').config({
  path: path.join(__dirname, '../.env'),
});

module.exports = (function onRun() {
  Logger.info('> Starting services');
  require('./discord');
}());
