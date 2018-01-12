var express = require('express')
var router = express.Router()
var utils = require('../helpers/utils')
var errors = require('../helpers/errors')

var Topic = require('../models/Topic')

router.use(function timeLog (req, res, next) {
	console.log('Time: ', Date.now())
	next();
});

router.get('/', function (req, res) {
	Topic.getAll(function(err, us)  {
		res.json(us);
	});
})

router.post('/create', function (req, res, next) {
	let newTopic = req.body;
	newTopic.name = req.sanitize(newTopic.name);
	newTopic.description = req.sanitize(newTopic.description);

	//validate input data
	if (utils.isNullOrEmpty(newTopic.name)) {
		next(errors.NULL_OR_EMPTY('name'));
	} else {
		Topic.create(newTopic, (err, topic) => {
			res.json(topic)
		});
	}

})

module.exports = router;