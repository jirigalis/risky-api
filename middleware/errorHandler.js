var express = require('express')
	, router = express.Router()
	, errors = require('../helpers/errors')
	;

function generalErrorHandler(err, req, res, next) {
	console.log("================================================")
	console.log(err)
	console.log("================================================")

	

	res.status(500).send(errors.UNEXPECTED)
}

module.exports = generalErrorHandler;