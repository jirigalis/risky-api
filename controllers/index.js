var express = require('express')
	, router = express.Router()
	, login = require('./login')
	, users = require('./users')
	, topics = require('./topics')
	, questions = require('./questions')
	, events = require('./events')
	, levels = require('./levels')
	, answers = require('./answers')
	, competitors = require('./competitors')
	, auth = require('../middleware/auth')
	, generalErrorHandler = require('../middleware/errorHandler')
	;

router.use(login);
router.use('/users', users);

router.use(auth);
router.use('/topics', topics);
router.use('/questions', questions);
router.use('/events', events);
router.use('/levels', levels)
;router.use('/answers', answers);
router.use('/competitors', competitors);
router.use(generalErrorHandler);

module.exports = router;