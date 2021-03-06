module.exports = router => {
  const async = require('async');

  const models = require('../../models');

  const { isLoggedIn } = require('./service');
  const { getProducts } = require('./helper');

  router.get('/profile', isLoggedIn, (req, res, next) => {
    req.user
      .getOrders({
        attributes: [
          'id',
          'amount',
          'paymentMethod',
          'description',
          'status',
          'createdAt'
        ],
        include: [{ model: models.Cart }],
        order: [['updatedAt', 'DESC']]
      })
      .then(orders => {
        if (orders.length <= 0) {
          res.render('user/profile', { userName: req.user.name });
        } else {
          async.each(
            orders,
            getProducts, // service function
            err => {
              if (err) throw err;
              res.render('user/profile', { orders, userName: req.user.name });
            } // END err => {
          ); // END async.each(
        } // END else {
      }); // END .then(orders => {
  }); // END router.get('/profile', isLoggedIn, (req, res, next) => {
};
