const express = require('express')
const app = express()
var db = require('./db')
var bodyParser = require('body-parser');
var morgan = require('morgan');
var routes = require('./controllers/index');

db.connect(function (err) {
	if (err) {
		console.log('Unable to connect to database.');
		console.log(err);
		process.exit(1);
	} else {
	}
})
//set super secret
app.set('superSecret', db.superSecret);

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//log request
app.use(morgan('dev'));

//routing
app.use(routes);

app.listen(3000, () => console.log('Listening on port 3000...'))		


