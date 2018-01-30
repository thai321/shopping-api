module.exports = router => {
  const { isLoggedIn, notLoggedIn } = require('./service');
  const passport = require('passport');

  router.get('/logout', isLoggedIn, (req, res, next) => {
    req.logout();
    res.redirect('/');
  });

  // If not logged in, then can't access the routes below: /user/signup, /user/signup
  // because already logged in
  router.use('/', notLoggedIn, (req, res, next) => {
    next();
  });

  router.get('/signup', (req, res, next) => {
    const messages = req.flash('error');
    res.render('user/signup', {
      csrfToken: req.csrfToken(),
      messages,
      hasErrors: messages.length > 0
    }); // END res.render('user/signup'
  }); // END router.get('/signup', (req, res, next)

  router.post(
    '/signup',
    passport.authenticate('local.signup', {
      // successRedirect: '/user/profile',
      failureRedirect: '/user/signup',
      failureFlash: true
    }), // END passport.authenticate('local.signup'
    (req, res, next) => {
      // this funtion will run if sign in success
      if (req.session.oldUrl) {
        const { oldUrl } = req.session;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
      } else {
        res.redirect('/user/profile');
      }
    } // END (req, res, next)
  ); // END router.post(

  router.get('/signin', (req, res, next) => {
    const messages = req.flash('error');
    res.render('user/signin', {
      csrfToken: req.csrfToken(),
      messages,
      hasErrors: messages.length > 0
    }); // END res.render('user/signin'
  }); // END router.get('/signin', (req, res, next)

  router.post(
    '/signin',
    passport.authenticate('local.signin', {
      // successRedirect: '/user/profile',
      failureRedirect: '/user/signin',
      failureFlash: true
    }), // END passport.authenticate('local.signin'
    (req, res, next) => {
      // this funtion will run if sign in success
      if (req.session.oldUrl) {
        const { oldUrl } = req.session;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
      } else {
        res.redirect('/user/profile');
      }
    } // END (req, res, next)
  ); // END router.post(
};
