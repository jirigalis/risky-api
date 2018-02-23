var express = require('express')
var router = express.Router()

var Event = require('../models/Event')

router.get('/', getAll);
router.get('/:id', getByID);
router.post('/new', create);
router.delete('/:id', remove);
router.put('/:id', update);


module.exports = router

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

function create(req, res, next) {
	event = {
		created: moment().unix(),
		author: req.body.author,
		competitors: req.body.competitors
	}
	Event.create(event, (err, event) => {
		if (err) {
			res.status(500);
			res.json(err)
		} else {
			res.json(event);
		}
	})
}

function remove(req, res, next) {

}

function update(req, res, next) {

}