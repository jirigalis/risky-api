var express = require('express')
	, router = express.Router()
	, errors = require('../helpers/errors')
	;

function generalErrorHandler(err, req, res, next) {
	console.log(err)
	res.status(500).send(errors.UNEXPECTED)
}

module.exports = generalErrorHandler;