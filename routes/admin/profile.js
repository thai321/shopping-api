module.exports = router => {
  const { isLoggedIn } = require('./service');

  router.get('/profile', isLoggedIn, (req, res, next) => {
    res.render('admin/profile');
  });
};
