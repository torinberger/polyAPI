const database = require('../database');
const Router = require('@koa/router');

const apiRouter = new Router();
      apiRouter.prefix('/api');

apiRouter.get('/', (ctx, next) => {
  ctx.body = "pong";
});

module.exports = apiRouter;
