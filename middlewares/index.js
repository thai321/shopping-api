const parsers = require('./parsers');
const sessions = require('./sessions');
const views = require('./views');
const passport = require('./passport');
// const loggers = require('./loggers');

const isDev = process.env.NODE_ENV === 'development';

module.exports = app => {
  parsers(app);
  sessions(app);
  passport(app);
  views(app);

  // Logger middleware in development enviroment
  // if (isDev) loggers(app);
};
