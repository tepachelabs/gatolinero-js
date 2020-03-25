const Rollbar = require("rollbar");

const tokenRollbar = process.env['TOKEN_ROLLBAR'];
const rollbar = new Rollbar({
  accessToken: tokenRollbar,
  captureUncaught: true,
  captureUnhandledRejections: true
});

module.exports = rollbar;
