const Rollbar = require('rollbar');

const tokenRollbar = process.env.TOKEN_ROLLBAR;
let rollbar;
if (tokenRollbar) {
  rollbar = new Rollbar({
    accessToken: tokenRollbar,
    captureUncaught: true,
    captureUnhandledRejections: true,
  });
} else {
  rollbar = {
    info: console.info,
    error: console.error,
    debug: console.debug,
  };
}
module.exports = rollbar;
