var express = require('express')
	, router = express.Router()
	, login = require('./login')
	, users = require('./users')
	, auth = require('../middleware/auth')
	;

router.use(login);

router.use(auth);
router.use(users)

router.get('/', (req, res) => {
	res.send('Hello Wolrd!');
})

module.exports = router;