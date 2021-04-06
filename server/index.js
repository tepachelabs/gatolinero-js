/* eslint-disable global-require */
const path = require('path');
const dotEnv = require('dotenv');
const dotenvExpand = require('dotenv-expand');

const globalEnv = dotEnv.config({
  path: path.join(__dirname, '../.env'),
});
dotenvExpand(globalEnv);
const Logger = require('./utils/logger');

module.exports = (function onRun() {
  Logger.info('> Starting services');
  if (process.env.TOKEN_DISCORD) {
    require('./discord');
  }
  if (process.env.TOKEN_TELEGRAM) {
    require('./telegram');
  }
  if (process.env.HTTP_SERVER_ENABLE === 'true') {
    require('./http');
  }
}());
