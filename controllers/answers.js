var express = require('express');
var router = express.Router();

var Answer = require('../models/Answer');

router.get('/', getAll);
router.get('/:id', getByID);
router.get('/question/:id', getByQuestionId);
router.post('/new', create);
router.put('/:id', update);
router.delete(':id', remove);

module.exports = router;

function getAll(req, res) {
    Answer.getAll((err, answers) => {
        res.json(answers);
    })
}

function getByID(req, res, next) {
    Answer.getByID(req.params.id, (err, answer) => {
        res.json(answer);
    })
}

function getByQuestionId(req, res, next) {
    Answer.getByQuestionID(req.params.qID, (err, answer) => {
        res.json(answer);
    })
}

function create(req, res, next) {
    let newAnswer = {
        id: req.params.id,
        question_id: req.body.qID,
        text: req.sanitize(req.body.text)
    }

    if (utils.isNullOrEmpty(newAnswer.question_id)) {
        next(errors.NULL_OR_EMPTY('question_id'));
    }
    if (utils.isNullOrEmpty(newAnswer.text)) {
        next(errors.NULL_OR_EMPTY('text'))
    }
    
    Answer.create(newAnswer, (err, newAnswer) => {
        res.json(newAnswer);
    })
}

function update(req, res, next) {    
    let answer = {
        id: req.params.id,
        question_id: req.body.qID,
        text: req.sanitize(req.body.text)
    }

    if (utils.isNullOrEmpty(answer.question_id)) {
        next(errors.NULL_OR_EMPTY('question_id'));
    }
    if (utils.isNullOrEmpty(answer.text)) {
        next(errors.NULL_OR_EMPTY('text'));
    }

    Answer.update(answer, (err, updatedAnswer) => {
        res.json(updatedAnswer);
    })
}

function remove(req, res, next) {
    Answer.delete(req.params.id, (err, deleted) => {
        if (err) {
            res.status(500);
            next(err);
        }
        res.json(deleted)
    })
}