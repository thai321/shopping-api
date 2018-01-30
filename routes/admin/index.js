const express = require('express');
const router = express.Router();
const passport = require('passport');
const async = require('async');

const models = require('../../models');

const { isLoggedIn, notLoggedIn } = require('./service');

// all the routes should be protected by csrf
const csrf = require('csurf');
const csrfProtection = csrf();
router.use(csrfProtection);

router.get('/profile', isLoggedIn, (req, res, next) => {
  res.render('admin/profile');
});

router.get('/logout', isLoggedIn, (req, res, next) => {
  req.logout();
  res.redirect('/');
});

// If not logged in, then can't access the routes below: /admin/signup, /admin/signup
// because already logged in
router.use('/', notLoggedIn, (req, rest, next) => {
  next();
});

router.get('/signup', (req, res, next) => {
  const messages = req.flash('error');
  res.render('admin/signup', {
    csrfToken: req.csrfToken(),
    messages,
    hasErrors: messages.length > 0
  }); // END res.render('admin/signup', {
}); // END router.get('/signup', (req, res, next) => {

router.post(
  '/signup',
  passport.authenticate('local.signup', {
    successRedirect: '/admin/profile',
    failureRedirect: '/admin/signup',
    failureFlash: true
  }) // END passport.authenticate('local.signup'
); // END router.post(

router.get('/signin', (req, res, next) => {
  const messages = req.flash('error');
  res.render('admin/signin', {
    csrfToken: req.csrfToken(),
    messages,
    hasErrors: messages.length > 0
  }); // END res.render('admin/signin', {
}); // END router.get('/signin', (req, res, next) => {

router.post(
  '/signin',
  passport.authenticate('local.signin', {
    successRedirect: '/admin/profile',
    failureRedirect: '/admin/signin',
    failureFlash: true
  }) // END passport.authenticate('local.sigin', {
); // END router.post(

module.exports = router;
