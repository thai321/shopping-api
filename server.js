const express = require('express');
const bodyParser = require('body-parser');
const path = require('path')

const middlewares = require('./config/middlewares');
const constants = require('./config/constants');

const Routes = require('./features');

const models = require('./models');
const app = express();

middlewares(app);

app.use('/', Routes)

// app.get('/', (req, res, next) => {
//   res.send("Test home page");
// })


const server = app.listen(constants.PORT, (err) => {
  if(err) {
    throw err;
  }

  console.log('Listening on port ', constants.PORT);
  console.log(`Enviroment: ${process.env.NODE_ENV}`);

  models.sequelize.sync().then(function() {
    console.log('Nice! Database looks fine')
  }).catch(function(err) {
    console.log(err, "Something went wrong with the Database Update!")
  });

})
