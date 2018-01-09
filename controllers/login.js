var express = require('express')
	, router = express.Router()
	, User = require('../models/User')
	, jwt = require('jsonwebtoken')
	;

router.post('/login', (req, res) => {
	User.getByLogin(req.body.login, (err, us) => {
		if (err) throw err;

		if (!us) {
			res.json({ success: false, message: 'Authentication failed. User not found.' });
		} else if (us) {
			if (us.password != req.body.password) {
				res.json({ success: false, message: 'Authentication failed. Wrong password.' })
			} else {
				const payload = {
					admin: us.admin
				};

				var token = jwt.sign(payload, router.get('superSecret'), {
					expiresIn: '20d' //expires in 24 hours
				});

				res.json({
					success: true,
					message: "Token is here",
					token: token
				});
			}

		}
	})
})

module.exports = router;