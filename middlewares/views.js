// flash error, and store the session token
const flash = require('connect-flash');
const expressHbs = require('express-handlebars');

module.exports = app => {

  // view engine setup
  app.engine('.hbs', expressHbs({ defaultLayout: 'layout', extname: '.hbs' }));
  app.set('view engine', 'hbs');

  app.use(flash());
  app.use((req, res, next) => {
    res.locals.loggedIn = req.isAuthenticated();

    // now we can access session in the view
    // Ex: session.cart
    res.locals.session = req.session;
    next();
  });
};
