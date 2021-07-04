var express = require('express');
var app = express.Router();
var jwt = require('jsonwebtoken');
var User = require('../models/user');

module.exports = function(req, res, next) {
	var token = req.token || req.headers['x-access-token'];
	if (token) {
		jwt.verify(token, process.env.secret, function(err, decoded) {
			if (err) {
				res.status(401);
				return res.json({success: false, message: 'Failed to authenticate token.'});
			} else {
				req.decoded = decoded;
				next();
			}
		})
	} else {
		return res.status(403).send({
			success: false,
			message: 'No token provided. Access denied.'
		});
	}
}