const debug = require('debug')('app:koa_app');
const Koa = require('koa');
const KoaLogger = require('koa-logger');
const helmet = require('koa-helmet');
const cors = require('@koa/cors');
const respond = require('koa-respond');
const ComponentsRouter = require('./components/router');

const app = new Koa();

const { SERVER_PROXY: SERVERPROXY, NODE_ENV = 'development', HTTP_CORS_DOMAINS = '*' } = process.env;

const validDomains = Object.fromEntries(HTTP_CORS_DOMAINS.split(',').map((domain) => [domain.trim(), true]));
const [defaultDomain] = Object.keys(validDomains);

if (SERVERPROXY === 'true') {
  debug('App behind proxy: %s', SERVERPROXY);
  app.proxy = true;
}

if (NODE_ENV !== 'production') {
  debug('Node env: %s', NODE_ENV);
  app.use(KoaLogger((str) => {
    debug(str);
  }));
}

/* Adds new responses methods to context */
app.use(respond());

/* Security */
app.use(helmet());

/* CORS */
app.use(cors({
  origin: function onOrigin(ctx) {
    if (validDomains[ctx.request.header.origin]) {
      return ctx.request.header.origin;
    }
    return defaultDomain;
  },
}));

/* Get router */

app.use(ComponentsRouter.allowedMethods());
app.use(ComponentsRouter.routes());

module.exports = app;
