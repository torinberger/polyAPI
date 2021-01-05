var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/polyapi', {useNewUrlParser: true, useUnifiedTopology: true});

module.exports = {
  log: require('./models/log.model.js'),
  user: require('./models/user.model.js'),
};
