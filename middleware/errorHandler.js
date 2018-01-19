var express = require('express')
	, router = express.Router()
	, errors = require('../helpers/errors')
	;

router.use(logErrors);

router.use((err, req, res, next) => {
	console.log('UNEXPECTED')
	res.sendStatus(400).send(errors.UNEXPECTED);
})

router.use(generalErrorHandler)

function logErrors(err, req, res, next) {
	console.log('logErrors');
	next(err)
}


function generalErrorHandler(err, req, res, next) {
	console.log('general')
	res.status(500)
	res.render('error', { error: err })
}

module.exports = router;