// flash error, and store the session token
const flash = require('connect-flash');
const expressHbs = require('express-handlebars');

const models = require('../models');

module.exports = app => {
  // view engine setup
  app.engine('.hbs', expressHbs({ defaultLayout: 'layout', extname: '.hbs' }));
  app.set('view engine', 'hbs');

  app.use(flash());
  app.use((req, res, next) => {
    const isAdmin = req.user instanceof models.Admin ? true : false;
    const loggedIn = req.isAuthenticated();

    res.locals.isAdminLoggedIn = isAdmin && loggedIn;
    res.locals.userloggedIn = !isAdmin && loggedIn;

    // now we can access session in the view
    // Ex: session.cart
    res.locals.session = req.session;
    next();
  });
};
