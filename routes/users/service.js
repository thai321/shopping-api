module.exports = {
  isLoggedIn,
  notLoggedIn
};

const models = require('../../models');

function isLoggedIn(req, res, next) {
  const isUser = req.user instanceof models.User ? true : false;

  if (isUser && req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/');
  }
}

function notLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) return next();
  res.redirect('/');
}
