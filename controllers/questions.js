const express = require('express');
const router = express.Router();
const utils = require('../helpers/utils');
const errors = require('../helpers/errors');

const Question = require('../models/Question');

router.get('/', getAll);
router.post('/new', create);
router.get('/:id', getByID);
router.get('/categories/:id', getByIdWithCategories);
router.get('/category/:id', getAllByCategory);
router.get('/category/:id/random', getRandomByCategory);
router.get('/:id/categories', getcategories);
router.get('/:id/attachment', getAttachment);
router.put('/:id', update);
router.put('/:id/status', setQuestionStatus);
router.delete('/delete/:id', deleteQuestion);

router.get('/test/aaa', (req, res) => {
	Question.getByIdWithCategories(2, (err, questions) => {
		if (err) {
			res.status(400).send('Error during processing query');
		};
		res.json(questions);
	})
});

module.exports = router

function getAll(req, res) {
	let params = {
		page: req.query.page,
		limit: req.query.limit,
		orderby: req.query.orderby
	}
	Question.getAllWithCategories((err, questions) => {
		if (err) {
			res.status(400).send('Error during processing query');
		};
		res.json(questions);
	});
}

function getByID(req, res, next) {
	Question.getByID(req.params.id, (err, question) => {
		res.json(question);
	})
}

function getByIdWithCategories(req, res, next) {
	Question.getByIdWithCategories(req.params.id, (err, question) => {
		if (err) {
			res.status(400).send('Error during seaerching question ' + req.params.id);
		}
		res.json(question);
	})
}

function getAllByCategory(req, res, next) {
	Question.getAllByCategory(req.params.id, (err, questions) => {
		res.json(questions);
	})
}

function getRandomByCategory(req, res, next) {
	Question.getRandomByCategory(req.params.id, (err, question) => {
		res.json(question);
	})
}

function getcategories(req, res, next) {
	Question.getcategories(req.params.id, (err, categories) => {
		res.json(categories);
	})
}
function create(req, res, next) {
	let question = {
		text: req.sanitize(req.body.text),
		level: req.body.level,
		attachment: req.body.attachment,
		categories: req.body.categories,
		answer: req.body.answer
	}
	Question.create(question, (err, question) => {
		if (err) {
			res.status(500);
			res.json(err)
		} else {
			res.json(question);
		}
	})
}

function getAttachment(req, res, next) {
	Question.getAttachmentByID(req.params.id, (err, attachment) => {
		res.json(attachment);
	})
}

function update(req, res, next) {
	const question = {
		id: req.params.id,
		text: req.sanitize(req.body.text),
		level: req.body.level,
		attachment: req.body.attachment,
		categories: req.body.categories,
		answer: req.body.answer
	};
	Question.update(question, (err, affectedRows) => {
		res.json(affectedRows)
	})
}

function deleteQuestion(req, res, next) {
	Question.delete(req.params.id, (err, deleted) => {
		if (err) {
			res.status(500);
			next(err);
		}
		res.json(deleted);
	})
}

function setQuestionStatus(req, res, next) {
	const questionId = req.params.id;
	const status = req.body.status;

	if(!_.includes([1,2,3], status)) {
		res.status(500);
		next('This status does not exist.');
	}

	Question.setQuestionStatus(questionId, status, (err, updatedQuestion) => {
		if (err) {
			res.status(500);
			next(err);
		}
		res.json(updatedQuestion);
	})
}
