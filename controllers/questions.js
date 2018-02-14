var express = require('express')
var router = express.Router()
var utils = require('../helpers/utils')
var errors = require('../helpers/errors')

var Question = require('../models/Question')

router.get('/', getAll);
router.post('/new', create);
router.get('/:id', getByID);
router.get('/topic/:id', getAllByTopicID);
router.get('/topic/:id/random', getRandomByTopic)
router.get('/:id/topics', getTopics);
router.put('/:id', update);

module.exports = router

function getAll(req, res) {
	Question.getAll(function(err, questions)  {
		res.json(questions);
	});
}

function getByID(req, res, next) {
	Question.getByID(req.params.id, (err, question) => {
		res.json(question);
	})
}

function getAllByTopicID(req, res, next) {
	Question.getAllByTopicID(req.params.id, (err, questions) => {
		res.json(questions);
	})
}

function getRandomByTopic(req, res, next) {
	Question.getRandomByTopic(req.params.id, (err, question) => {
		res.json(question);
	})
}

function getTopics(req, res, next) {
	Question.getTopics(req.params.id, (err, topics) => {
		res.json(topics);
	})
}
function create(req, res, next) {
	let question = {
		text: req.sanitize(req.body.text),
		level: req.body.level,
		attachment: req.body.attachment,
		topics: req.body.topics
	}
	Question.create(question, (err, question) => {
		res.json(question);
	})
}

function update(req, res, next) {
	let question = {
		id: req.params.id,
		text: req.sanitize(req.body.text),
		level: req.body.level,
		attachment: req.body.attachment,
		topics: req.body.topics
	}
	Question.update(question, (err, affectedRows) => {
		res.json(affectedRows)
	})
}