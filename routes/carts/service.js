module.exports = {
  notAdmin
};

const models = require('../../models');

function notAdmin(req, res, next) {
  if (!req.user || req.user instanceof models.User) {
    return next();
  } else if (req.user instanceof models.Admin && req.isAuthenticated()) {
    res.redirect('/');
  }
}
