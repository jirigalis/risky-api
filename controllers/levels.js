var express = require('express')
var router = express.Router()

var Level = require('../models/Level')

router.get('/', getAll)
router.get('/:id', getByID)

module.exports = router

function getAll(req, res, next) {
	Level.getAll((err, levels) => {
		res.json(levels);
	})
}

function getByID(req, res, next) {
	Level.getByID(req.params.id, (err, level) => {
		res.json(level);
	});
}