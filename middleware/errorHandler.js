var express = require('express')
	, router = express.Router()
	, errors = require('../helpers/errors')
	;

function generalErrorHandler(err, req, res, next) {
	console.log("================================================")
	console.log(err)
	console.log("================================================")

	//error is already handled:
	if (typeof err === 'object' && typeof err.code !== 'undefined') {
		return res.status(err.code).send(err.msg);
	}

	//check DB error
	if ("undefined" !== typeof err.code) {
		return handleDatabaseError(err, req, res, next);
	}

	res.status(500).send(errors.UNEXPECTED)
}

function handleDatabaseError(err, req, res, next) {
	const errCode = err.code;

	if (!errCode) {
		return res.status(500).send(errors.UNEXPECTED);
	}

	switch (errCode) {
		case "ER_DUP_ENTRY": {
			return res.status(409).send(err.sqlMessage);
		}
		case "ER_BAD_NULL_ERROR": {
			return res.status(400).send(err.sqlMessage);
		}
		default: {
			return res.status(500).send(errors.UNEXPECTED_DATABASE);
		}
	}
}

module.exports = generalErrorHandler;