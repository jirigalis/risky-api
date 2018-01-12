var express = require('express')
	, router = express.Router()
	, login = require('./login')
	, users = require('./users')
	, topics = require('./topics')
	, auth = require('../middleware/auth')
	, errorHandler = require('../middleware/errorHandler')
	;

router.use(login);

router.use(auth);
router.use('/users', users);
router.use('/topics', topics);

router.get('/', (req, res) => {
	res.send('Hello Wolrd!');
})

router.use(errorHandler);

module.exports = router;