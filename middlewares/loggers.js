// Log request to console
module.exports = app => {
  const morgan = require('morgan');
  const volleyball = require('volleyball');
  app.use(morgan('dev'));
  // app.use(volleyball);
};
