// Cookie and session
const cookieParser = require('cookie-parser');
const session = require('express-session');
const constants = require('../config/constants');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const db = require('../models');

module.exports = app => {
  app.use(cookieParser());
  app.use(session(
    {
      secret: constants.JWT_SECRET,
      resave: false,
      saveUninitialized: false,
      store: new SequelizeStore({ db: db.sequelize }),
      cookie: { maxAge: 180 * 60 * 100 }, // 180 mins * 60 * 1000 ms = 3 hours
    }
  ));
};
