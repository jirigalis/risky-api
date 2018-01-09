var express = require('express')
	, router = express.Router()
	, User = require('../models/user')
	, login = require('./login')
	, auth = require('../middleware/auth')
	;

router.use(login);

router.use(auth);

module.exports = router;