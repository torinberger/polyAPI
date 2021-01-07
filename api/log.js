const database = require('../database');
const Router = require('@koa/router');

const logRouter = new Router();
      logRouter.prefix('/logs');

logRouter.post('/get', async (ctx, next) => {
  // extract POST parameters
  const postData = ctx.request.body;
  const { userName, schedule, adapted } = postData;
  console.log(postData);

  const userInDB = await database.users.find({ userName }).exec();
  if (userInDB) {
    let logsInDB = await database.logs.find({ userName }).exec();

    if(adapted !== undefined) { // check whether the adaptation status matters
      for (var i = 0; i < userInDB.historicSchedules.length; i++) {
        // check whether historic adaptation attempt is for the correct schedule
        if (userInDB.historicSchedules[i].name === schedule || schedule === undefined) {
          // check whether history adaptation was adapted too
          if (!!userInDB.historicSchedules[i].adaptDate !== adapted || adapted === undefined) {
            // the history schedule was the correct schedule and it wasn't adapted to
            logsInDB.splice(i, 1); // remove it
          }
        }
      }
    }
  } else {
    ctx.status = 401;
  }

  ctx.status = 200;
  ctx.body = logsInDB;
});

logRouter.post('/entries/get', async (ctx, next) => {
  // extract POST parameters
  const postData = ctx.request.body;
  const { userName,
          schedule,
          adapted,
          day,
          moods,
          awakeDifficulty,
          oversleepTime,
          attachment,
          loggedFrom,
          loggedTo } = postData;
  console.log(postData);

  const userInDB = await database.users.find({ userName }).exec();
  if (userInDB) {
    let logsInDB = await database.logs.find({ userName }).exec();

    for (var i = 0; i < userInDB.historicSchedules.length; i++) {
      for (var i = 0; i < userInDB.historicSchedules.length; i++) {

      }
    }
  } else {
    ctx.status = 401;
  }

  ctx.status = 200;
  ctx.body = logsInDB;
});

module.exports = logRouter;
