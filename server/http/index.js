const debug = require('debug')('app:http_server');
const http = require('http');
const chalk = require('chalk');
const Logger = require('#utils/logger');
const App = require('./app');

// Getting environment variables
const HOST = process.env.HTTP_SERVER_HOST || '0.0.0.0';
const PORT = process.env.HTTP_SERVER_PORT || 8000;

// Server
const httpServer = http.createServer(App.callback());

function listenAsync(port, host) {
  return new Promise(function asyncResolve(resolve) {
    httpServer.listen(port, host, function callback() {
      return resolve();
    });
  });
}

// Listen
listenAsync(PORT, HOST).then(() => {
  debug('%s Backend running at http://%s:%d', chalk.green('✓'), HOST, PORT);
  debug('  CTRL-C to end the process\n');
  if (!process.env.NODE_APP_INSTANCE || process.env.NODE_APP_INSTANCE === '0') { // Nodo maestro.

  }
}).catch((error) => {
  debug('Error', error);
  Logger.error(error);
});
