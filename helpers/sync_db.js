const models = require('../models');

module.exports = () => {
  models.sequelize
    .sync()
    .then(() => {
      console.log('Completed syncing to the database');
      process.exit(0);
    })
    .catch(err => {
      console.log(err, 'Something went wrong with the Database Update!');
    });
};
