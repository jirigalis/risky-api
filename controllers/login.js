var express = require('express')
	, router = express.Router()
	, User = require('../models/User')
	, jwt = require('jsonwebtoken')
	, db = require('../db')
	;

router.post('/login', (req, res) => {
	console.log(req.body.login, req.body.password);
	if (!(req.body.login && req.body.password)) {
		res.status(403).send(errors.MISSING_CREDENTIALS);
		return;
	}
	User.getByLogin(req.body.login, (err, us) => {
		if (err) throw err;

		if (!us) {
			res.json({ success: false, message: errors.WRONG_CREDENTIALS });
		} else if (us) {
			if (us.password != req.body.password) {
				res.json({ success: false, message: errors.WRONG_CREDENTIALS })
			} else {
				const payload = {
					admin: us.admin
				};

				var token = jwt.sign(payload, db.superSecret, {
					expiresIn: '24h' //expires in 24 hours
				});

				res.json({
					success: true,
					message: "Token is here",
					user: us,
					token: token
				});
			}

		}
	})
})

module.exports = router;