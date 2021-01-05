const Koa = require('koa');
const Router = require('@koa/router');
const cors = require('@koa/cors');
const bodyParser = require('koa-bodyparser')

const app = new Koa();
const router = new Router();

app
  .use(cors())
  .use(bodyParser());

router.get('/', (ctx, next) => {
  ctx.body = "pong";
});

const apiRouter = require('./api');

app
  .use(router.routes())
  .use(router.allowedMethods())
  .use(apiRouter.routes())
  .use(apiRouter.allowedMethods());

app.listen(3000);
