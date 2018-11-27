var express = require('express')
var router = express.Router()

var Topic = require('../models/Topic')

router.get('/', function (req, res) {
	Topic.getAll(function(err, us)  {
		res.json(us);
	});
})

router.get('/:id', getById);
router.get('/question/:id', getByQuestionId);
router.post('/new', createTopic);
router.put('/:id', updateTopic);
router.delete('/delete/:id', deleteTopic);

module.exports = router;

function getById(req, res, next) {
	Topic.getByID(req.params.id, (err, topic) => {
		res.json(topic);
	})
}

function createTopic(req, res, next) {
	let newTopic = req.body;
	newTopic.name = req.sanitize(newTopic.name);
	newTopic.description = req.sanitize(newTopic.description);

	//validate input data
	if (utils.isNullOrEmpty(newTopic.name)) {
		next(errors.NULL_OR_EMPTY('name'));
	} else {
		try {
			//TODO: check if this name already exist
			Topic.create(newTopic).then(newTopic => {
				res.json(newTopic);
			}).catch(err => {
				next(err.sqlMessage);
			})
		} catch (err) {
			console.log("ERR");
			console.log(err);
			next(err);
		}
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
		if (err) {
			res.status(500);
			next(err);
		}
		res.json(deleted);
	});
}

function getByQuestionId(req, res, next) {
	Topic.getByQuestionId(req.params.id, (err, topics) => {
		res.json(topics);
	});
}