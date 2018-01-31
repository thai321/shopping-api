const express = require('express');
const path = require('path');

const middlewares = require('./middlewares');
const allRoutes = require('./routes');

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

const env = process.env.NODE_ENV;
if (env === 'sync' || env === 'travis') {
  require('./helpers/sync_db')();
} else if (env === 'test') {
  require('./helpers/listen')(app);
} else {
  require('./helpers/listen_and_sync_db')(app);
}

module.exports = { app };
