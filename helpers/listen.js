const constants = require('../config/constants');

module.exports = app => {
  app.listen(constants.PORT, err => {
    if (err) throw err;

    console.log('Listening on port:', constants.PORT);
    console.log(`Enviroment: ${process.env.NODE_ENV}`);
    console.log(
      'Process ' + process.pid + ' is listening to all incoming requests'
    );
  }); // app.listen(constants.PORT, err => {
};
