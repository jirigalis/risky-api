var express = require('express')
var router = express.Router()

var Topic = require('../models/Topic')

router.use(function timeLog (req, res, next) {
	console.log('Time: ', Date.now())
	next();
});

router.get('/', function (req, res) {
	Topic.getAll(function(err, us)  {
		res.json(us);
	});
})

router.post('/create', function (req, res) {
	console.log("asda", res.body);
	res.send(req.body)
})

module.exports = router;