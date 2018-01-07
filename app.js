const express = require('express')
const app = express()
var db = require('./db')
var birds = require('./birds')
var user = require('./models/user');

app.get('/', (req, res) => {
	//res.send('Hello World2!<br><small>Requested at: ' + req.requestTime + '</small>');
	user.getAll(function(err, us)  {

		res.send(JSON.stringify(us));
	});
})

app.use('/birds', birds);

db.connect(function (err) {
	if (err) {
		console.log('Unable to connect to database.');
		console.log(err);
		process.exit(1);
	} else {
		app.listen(3000, () => console.log('Listening on port 3000...'))
	}
})