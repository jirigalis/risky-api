var express = require('express')
var router = express.Router()
var utils = require('../helpers/utils')
var errors = require('../helpers/errors')

var Question = require('../models/Question')

router.get('/', getAll);

module.exports = router

function getAll(req, res) {
	Question.getAll(function(err, questions)  {
		res.json(questions);
	});
}