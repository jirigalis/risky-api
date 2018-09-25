var express = require('express')
	, router = express.Router()
	, User = require('../models/User')
	;

router.get('/', (req, res) => {
	User.getAll(function(err, us)  {
		res.json(us);
	});
})

router.post('/new', createUser);

function createUser(req, res, next) {
	let newUser = req.body;
	newUser.email = req.sanitize(newUser.email);
	newUser.name = req.sanitize(newUser.name);

	console.log(req.body);

	if (utils.isNullOrEmpty(newUser.email) || utils.isNullOrEmpty(newUser.name)) {
		next(errors.NULL_OR_EMPTY('email or name'))
	} else {
		User.create(newUser.email, newUser.name, newUser.password, (err, user) => {
			res.json(user)
		});
	}
}

module.exports = router;