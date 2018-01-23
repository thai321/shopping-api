const router = require('express').Router();

const authController  = require('./auth-controller');
const AuthServices = require('./auth-services');

router.post('/register', authController.signup);
router.post('/login', AuthServices.loginMiddleware, authController.login);

module.exports = router;
