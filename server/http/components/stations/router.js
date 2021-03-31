const Router = require('@koa/router');
const Joi = require('joi');
const Ctrl = require('./controller');
const Validate = require('#http/middleware/Validate.middleware');

const router = new Router();

router.get('/', Validate({
  query: {
    latitude: Joi.number().min(-90).max(90),
    longitude: Joi.number().min(-180).max(180),
    distance: Joi.number().integer().positive().max(10000),
  },
}), Ctrl.getStations);

module.exports = router;
