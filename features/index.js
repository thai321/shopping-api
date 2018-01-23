const routes = require('express').Router();

const authRoutes = require('./auth');
const AutheServices = require('./auth/auth-services');

routes.use('/auth', authRoutes);

routes.get('/helloworld', AutheServices.jwtMiddleware ,(req, res) => {
  res.send('If you see this, that mean you logged');
});

module.exports = routes;
