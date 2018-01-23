const passport = require('passport');
const LocalStrategy = require('passport-local');
const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;

const constants = require('../../config/constants');
const User = require('../../models').User;


const localOpts = {
  usernameField: 'email'
};

const localLogin = new LocalStrategy(localOpts, (email, password, done) => {
  try {
    User.find({ where: { email } })
      .then(user => {
        if (!user) {
          return done(null, false);
        } else if (!user.authenticate(password)) {
          return done(null, false);
        }

        return done(null, user);
      });
  } catch (error) {
    return done(error, false);
  }
});

const jwtOpts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('JWT'),
  secretOrKey: constants.JWT_SECRET
};

const jwtLogin = new JwtStrategy(jwtOpts, (payload, done) => {
  try {
    User.findById(payload.id).then(user => {
      if(!user) {
        return done(null, false);
      }

      return done(null, user);
    })
  } catch (error) {
    return (error, false);
  }
});

passport.use(localLogin);
passport.use(jwtLogin);

module.exports = {
  authLocal: passport.authenticate('local', { session: false }),
  authJwt: passport.authenticate('jwt', { session: false }),
};
