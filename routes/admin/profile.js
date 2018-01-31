module.exports = router => {
  const async = require('async');

  const { isLoggedIn } = require('./service');
  const models = require('../../models');

  router.get('/profile', isLoggedIn, (req, res, next) => {
    res.render('admin/profile');
  });

  router.get('/users', isLoggedIn, (req, res, next) => {
    models.User.findAll({
      include: [{ model: models.Order }, { model: models.Cart }]
    }).then(users => {
      res.render('admin/user-list', {
        users,
        length: users.length
      }); // END res.render('admin/user-list', {
    }); // END }).then(users => {
  }); // END router.get('/users', isLoggedIn, (req, res, next) => {

  router.get('/users/:id', isLoggedIn, (req, res, next) => {
    const userId = req.params.id;

    models.User.findById(userId).then(user => {
      user
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
            res.render('user/profile', { userName: user.name });
          } else {
            async.each(orders, getProducts, err => {
              if (err) throw err;
              res.render('user/profile', { orders, userName: user.name });
            });
          }
        }); // END .then(orders => {
    }); // END models.User.findById(userId).then(user => {
  }); // END router.get('/users/:id', isLoggedIn, (req, res, next) => {
}; // END module.exports = router => {
