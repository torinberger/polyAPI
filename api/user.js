const database = require('../database');
const Router = require('@koa/router');

const userRouter = new Router();
      userRouter.prefix('/users');

userRouter.get('/', (ctx, next) => {
  ctx.body = "pong";
});

module.exports = userRouter;
