module.exports = router => {
  const async = require('async');

  const models = require('../../models');

  const { isLoggedIn } = require('./service');
  const { getProducts } = require('./helper');

  router.get('/profile', isLoggedIn, (req, res, next) => {
    const { id } = req.user;

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
          res.render('user/profile', { empty: true });
        } else {
          async.each(
            orders,
            getProducts, // service function
            err => {
              if (err) throw err;
              res.render('user/profile', { orders });
            } // END err => {
          ); // END async.each(
        } // END else {
      }); // END .then(orders => {
  }); // END router.get('/profile', isLoggedIn, (req, res, next) => {
};
