var express = require('express')
	, router = express.Router()
	, User = require('../models/User')
	;

router.get('/', (req, res) => {
	User.getAll(function(err, us)  {
		res.json(us);
	});
})

module.exports = router;