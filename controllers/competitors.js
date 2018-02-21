var express = require('express')
var router = express.Router()

var Competitor = require('../models/Competitor')

router.get('/', function (req, res) {
	Competitor.getAll(function(err, us)  {
		res.json(us);
	});
})

router.get('/:id', getById);
router.post('/new', createCompetitor);
router.put('/:id', updateCompetitor);
router.delete('/delete/:id', deleteCompetitor);

function getById(req, res, next) {
	Competitor.getByID(req.params.id, (err, competitor) => {
		res.json(competitor);
	})
}

function createCompetitor(req, res, next) {
	let newCompetitor = {
		name: req.sanitize(req.body.name),
		note: req.sanitize(req.body.note)
	}
	//validate input data
	if (utils.isNullOrEmpty(newCompetitor.name)) {
		next(errors.NULL_OR_EMPTY('name'));
	} else {
		Competitor.create(newCompetitor, (err, competitor) => {
			if (err) {
				res.status(500);
				next(err);
			}
			res.json(competitor)
		});
	}
}

function updateCompetitor(req, res, next) {
	let competitor = {
		id: req.params.id,
		name: req.sanitize(req.body.name),
		note: req.sanitize(req.body.note)
	}

	if(utils.isNullOrEmpty(competitor.name)) {
		next(errors.NULL_OR_EMPTY('name'));
	} else {
		Competitor.update(competitor, (err, updatedCompetitor) => {
			res.json(updatedCompetitor);
		});
	}
}

function deleteCompetitor(req, res, next) {
	Competitor.delete(req.params.id, (err, deleted) => {
		if (err) {
			res.status(500);
			next(err);
		}
		res.json(deleted);
	});
}

module.exports = router;