const path = require('path');
const dotEnv = require('dotenv');
const dotenvExpand = require('dotenv-expand');

const globalEnv = dotEnv.config({
  path: path.join(__dirname, '../../.env'),
});
dotenvExpand(globalEnv);

const supertest = require('supertest');
const app = require('#http/app');

module.exports = supertest(app.listen());
