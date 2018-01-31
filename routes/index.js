const userRoutes = require('./users');
const adminRoutes = require('./admin');

const homeRoutes = require('./home'); // products
const cartRoutes = require('./carts');
const checkoutRoutes = require('./checkout');

module.exports = app => {
  app.use('/user', userRoutes);
  app.use('/admin', adminRoutes);
  app.use('/', homeRoutes);
  app.use('/', cartRoutes);
  app.use('/', checkoutRoutes);

  require('./default')(app); // default route
};
