const express = require('express');
const router = express.Router();

// all the routes should be protected by csrf
const csrf = require('csurf');
const csrfProtection = csrf();
router.use(csrfProtection);

require('./profile')(router);
require('./auth')(router);

module.exports = router;
