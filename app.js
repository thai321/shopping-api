const express = require('express');
const path = require('path');

const middlewares = require('./middlewares');
const constants = require('./config/constants');
const allRoutes = require('./routes');
const models = require('./models');
const workersReady = require('./services/cluster');

const env = process.env.NODE_ENV;
const app = express();

// Middleware
middlewares(app);

// All routes in routes folder
allRoutes(app);

// serve static files like images, css, html, etc
// any get request that matches a particular file in the /public folder
// can be found and sent back
// for example - GET request to
// localhost:3000/large.jpg will send back a puppy image
app.use(express.static(path.join(__dirname, '/public')));

if (env !== 'test') {
  if (workersReady()) {
    app.listen(constants.PORT, err => {
      if (err) throw err;

      console.log('Listening on port:', constants.PORT);
      console.log(`Enviroment: ${env}`);
      console.log(
        'Process ' + process.pid + ' is listening to all incoming requests'
      );

      models.sequelize
        .sync()
        .then(function() {
          console.log('Nice! Database looks fine');
        })
        .catch(function(err) {
          console.log(err, 'Something went wrong with the Database Update!');
        });
    }); // app.listen(constants.PORT, err => {
  } // END if (workersReady()) {
} else {
  app.listen(constants.PORT, err => {
    if (err) throw err;

    console.log('Listening on port:', constants.PORT);
    console.log(`Enviroment: ${env}`);
    console.log(
      'Process ' + process.pid + ' is listening to all incoming requests'
    );
  }); // app.listen(constants.PORT, err => {
}

module.exports = { app };
