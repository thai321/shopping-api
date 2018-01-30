const workersReady = require('../services/cluster');
const models = require('../models');
const constants = require('../config/constants');

module.exports = app => {
  if (workersReady()) {
    app.listen(constants.PORT, err => {
      if (err) throw err;

      console.log(
        'Process ' + process.pid + ' is listening to all incoming requests'
      );

      models.sequelize
        .sync()
        .then(() => {
          console.log('Completed syncing to the database');
        })
        .catch(err => {
          console.log(err, 'Something went wrong with the Database Update!');
        });
    }); // app.listen(constants.PORT, err => {
  } // END if (workersReady()) {
};
