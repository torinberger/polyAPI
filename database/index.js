var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/polyapi', {useNewUrlParser: true, useUnifiedTopology: true});

module.exports = {
  logs: require('./models/log.model.js'),
  users: require('./models/user.model.js'),
};
