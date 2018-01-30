module.exports = {
  isLoggedIn,
  notLoggedIn
};

const models = require('../../models');
function isLoggedIn(req, res, next) {
  const isAdmin = req.user instanceof models.Admin ? true : false;
  const loggedIn = req.isAuthenticated();

  if (isAdmin && loggedIn) {
    return next();
  } else if (loggedIn) {
    res.redirect('/user/profile');
  } else {
    res.redirect('/user/signin');
  }
}

function notLoggedIn(req, res, next) {
  const isAdmin = req.user instanceof models.Admin ? true : false;
  const loggedIn = req.isAuthenticated();

  if (isAdmin && loggedIn) {
    res.redirect('/admin/profile');
  } else if (loggedIn) {
    res.redirect('/user/profile');
  } else {
    return next();
  }
}
