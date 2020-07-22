const errorLoger = require('../middleware/error-loger')
module.exports = app => {
  require('./vessel/vessel')(app);
  app.use('/', require('./home'));
  app.use('/app/log', require('./log'));
  app.use('/api/user', require('./user'));
  app.use('/api/auth', require('./authentication'));
  app.use('/api/al', require('./groupAccessLevel'));
  app.use('/api/voyage', require('./voyage'));

  app.use(errorLoger);
};
