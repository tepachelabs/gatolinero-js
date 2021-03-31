const Router = require('@koa/router');
const StationsRouter = require('./stations/router');

const router = new Router();

/**
 *
 * @api {get} / Base backend
 * @apiName getBaseBackend
 * @apiGroup Base
 * @apiVersion  1.0.0
 * @apiSuccessExample {string} Success-Response:
 * {"name":"Backend","version":"1.0.0"}
 *
 */
router.get('/', function mainGet(ctx) {
  ctx.ok({
    name: 'Backend',
    version: '1.0.0',
  });
});

router.use('/stations', StationsRouter.allowedMethods(), StationsRouter.routes());

module.exports = router;
