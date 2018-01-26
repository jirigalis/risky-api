var express = require('express')
var router = express.Router()

var Event = require('../models/Event')

router.get('/', getAll);
router.get('/:id', getByID);

function getAll(req, res, next) {
	Event.getAll((err, events) => {
		res.json(events);
	})
}

function getByID(req, res, next) {
	Event.getByID(req.params.id, (err, event) => {
		res.json(event);
	});
}