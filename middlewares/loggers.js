const morgan = require('morgan');
const volleyball = require('volleyball');

// Log request to console
module.exports = app => {
  app.use(morgan('dev'));
  app.use(volleyball);
}
