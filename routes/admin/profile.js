module.exports = router => {
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
      });
    });
  });
};
