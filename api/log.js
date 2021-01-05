const database = require('../database');
const Router = require('@koa/router');

const logRouter = new Router();
      logRouter.prefix('/logs');

logRouter.get('/', (ctx, next) => {
  ctx.body = "pong";
});

module.exports = logRouter;
