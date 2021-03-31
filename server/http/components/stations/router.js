const Router = require('@koa/router');
const Ctrl = require('./controller');

const router = new Router();

router.get('/', Ctrl.getStations);

module.exports = router;
