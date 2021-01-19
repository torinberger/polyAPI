const database = require('../database');
const util = require('../util');
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

/* params:
userName,
schedule,
adapted,
day,
moods,
awakeDifficulty,
oversleepTime,
attachment,
loggedFrom,
loggedTo
*/
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

  // find user in database
  const userInDB = await database.users.find({ userName }).exec();
  if (userInDB) {
    postData = util.cleanObj(postData); // remove all empty params
    // find all logs associated with user
    let logsInDB = await database.logs.find({userName, schedule}).exec();
    // delete post data that does not match with the database format
    delete postData.userName;
    delete postData.schedule;
    delete postData.loggedFrom;
    delete postData.loggedTo;

    let entries = {};

    // if the user has any associated logs
    if (logsInDB.length > 0) {
      let k = -1;
      for (var n = 0; n < userInDB.historicSchedules.length; n++) {
        if(userInDB.historicSchedules[n].name == schedule) {
          k += 1;
          // chech if adaptation status matters if so, remove if not adapted
          if (adapted !== undefined && !userInDB.historicSchedules[n].adaptDate) {
            logsInDB.splice(k, 1);
          }
        }
      }

      for (var i = 0; i < logsInDB.length; i++) {

        // find entries
        let entriesInLogs = logsInDB[i].entries;

        for (var n = 0; n < entriesInLogs.length; n++) {
          if (loggedFrom && loggedTo) {
            if (!(loggedFrom <= entriesInLogs[n].adaptDate && entriesInLogs[n].adaptDate <= loggedTo)) {
              entriesInLogs.splice(i, 1);
              continue;
            }
          } if (day !== undefined) {
            if (entriesInLogs[n].day != day) {
              entriesInLogs.splice(i, 1);
              continue;
            }
          } if (moods !== undefined) {
            if (entriesInLogs[n].moods != moods) {
              entriesInLogs.splice(i, 1);
              continue;
            }
          } if (awakeDifficulty !== undefined) {
            if (entriesInLogs[n].awakeDifficulty != awakeDifficulty) {
              entriesInLogs.splice(i, 1);
              continue;
            }
          } if (oversleepTime !== undefined) {
            // delete if overlseep time is greater than time provided
            if (entriesInLogs[n].oversleepTime < oversleepTime) {
              entriesInLogs.splice(i, 1);
              continue;
            }
          } if (attachment !== undefined) {
            // check if attachment exists
            if (!entriesInLogs[n].attachment) {
              entriesInLogs.splice(i, 1);
              continue;
            }
          }
        }

        entries[`${logsInDB.schedule}-attempt${logsInDB.attempt}`] = entriesInLogs;
      }
    }
  } else {
    ctx.status = 401;
  }

  ctx.status = 200;
  ctx.body = entries;
});

logRouter.post('/summary', async (ctx, next) => {
  // extract POST parameters
  const postData = ctx.request.body;
  const { userName,
          schedule } = postData;

  let historics = {};

  let userInDB = await database.users.find({ userName }).exec();
  if(userInDB) {
    for (var i = 0; i < userInDB.historicSchedules.length; i++) {
      if(userInDB.historicSchedules[i].name == schedule) {
        if(historics[schedule]) {
          historics[schedule].attempts += 1;
          if (userInDB.historicSchedules[i].adaptDate !== undefined) {
            historics[schedule].adaptations += 1;
          }
        } else {
          historics[schedule].attempts = 1;
          if (userInDB.historicSchedules[i].adaptDate !== undefined) {
            historics[schedule].adaptations = 1;
          } else {
            historics[schedule].adaptations = 0;
          }
        }
      }
    }
  }

  ctx.status = 200;
  ctx.body = historics;
});

module.exports = logRouter;
