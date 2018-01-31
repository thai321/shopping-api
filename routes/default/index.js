// Default route

module.exports = app => {
  const models = require('../../models');

  app.use((req, res, next) => {
    const isAdmin = req.user instanceof models.Admin ? true : false;
    const loggedIn = req.isAuthenticated();

    if (isAdmin && loggedIn) {
      res.redirect('/admin/profile');
    } else if (loggedIn) {
      res.redirect('/user/profile');
    } else {
      res.redirect('/');
    }
  });
};
