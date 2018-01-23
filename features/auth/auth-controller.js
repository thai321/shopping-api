module.exports = {
  signup,
  login
}

const AuthServices = require('./auth-services');

function signup(req, res) {
  try {
    AuthServices.register(req.body)
      .then(user => {
        return res.status(200).json(user);
      })
  } catch (error) {
    return res.status(400).json({ error: String(error) });
  }
};

function login(req, res, next) {
  res.status(200).json(req.user.toAuthJSON());

  return next();
}
