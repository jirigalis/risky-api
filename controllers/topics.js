var express = require('express')
var router = express.Router()

var Topic = require('../models/Topic')

router.get('/', function (req, res) {
	Topic.getAll(function(err, us)  {
		res.json(us);
	});
})

router.post('/create', createTopic);
router.put('/update/:id', updateTopic);
router.delete('/delete/:id', deleteTopic);

module.exports = router;

function createTopic(req, res, next) {
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
}

function updateTopic(req, res, next) {
	let topic = {
		id: req.params.id,
		name: req.sanitize(req.body.name),
		description: req.sanitize(req.body.description)
	}

	if(utils.isNullOrEmpty(topic.name)) {
		next(errors.NULL_OR_EMPTY('name'));
	} else {
		Topic.update(topic, (err, updatedTopic) => {
			res.json(updatedTopic);
		});
	}
}

function deleteTopic(req, res, next) {
	Topic.delete(req.params.id, (err, deleted) => {
		res.json(deleted);
	});
}