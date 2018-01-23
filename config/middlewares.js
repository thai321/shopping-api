const bodyParser = require('body-parser');

const isDev = process.env.NODE_ENV === 'development';

module.exports = (app) => {
  // User body-parser to get POST request for API use
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  if(isDev) {
    const morgan = require('morgan');
    const volleyball = require('volleyball');
    // Log request to console
    app.use(morgan('dev'));
    app.use(volleyball);
  }
}
