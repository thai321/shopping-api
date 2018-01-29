const homeRoutes = require('./home');
const userRoutes = require('./users');
const cartRoutes = require('./carts');
const checkoutRoutes = require('./checkout');

module.exports = app => {
  app.use('/user', userRoutes);
  app.use('/', homeRoutes);
  app.use('/', cartRoutes);
  app.use('/', checkoutRoutes);
}
