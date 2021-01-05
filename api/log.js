const database = require('../database');
const Router = require('@koa/router');

const logRouter = new Router();
      logRouter.prefix('/logs');

logRouter.post('/get', (ctx, next) => {
  const postData = ctx.request.body;
  console.log(postData);
  ctx.status = 200;
});

module.exports = logRouter;
