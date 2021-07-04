const express = require('express')
	, router = express.Router()
	, User = require('../models/User')
	, jwt = require('jsonwebtoken')
	, errors = require('../helpers/errors')
	, bcrypt = require('bcrypt')
	;
const { body, validationResult } = require('express-validator');

router.post('/login', [
	body('email').isLength({ min: 3 }).not().isEmpty().trim().escape(),
	body('password').not().isEmpty()
], (req, res) => {
		const err = validationResult(req);
		if (!err.isEmpty()) {
			return res.status(401).json(errors.MISSINGCREDENTIALS);
		}
	
		User.getByEmail(req.body.email, (err, user) => {
			if (err) throw err;
			if (!user) {
				res.status(401).json({ success: false, message: errors.WRONG_CREDENTIALS });
			} else if (user) {
				bcrypt.compare(req.body.password, user.password, (err, hashComparsion) => {
					if (!hashComparsion) {
						return res.status(401).json({ success: false, message: errors.WRONG_CREDENTIALS })
					} else {
						const payload = {
							admin: user.admin
						};

						const token = jwt.sign(payload, process.env.secret, {
							expiresIn: '24h' //expires in 24 hours
						});

						//we don't want to send user's password back
						delete user.password;
						delete user.salt;

						return res.json({
							success: true,
							message: "Token is here",
							user: user,
							token: token
						});
					}
				})
			}
	})
})

module.exports = router;