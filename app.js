const express = require('express')
const app = express()
var db = require('./db')
app.set('superSecret', db.superSecret);
var bodyParser = require('body-parser');
var morgan = require('morgan');
var routes = require('./controllers/index');

var birds = require('./birds')
var User = require('./models/user');

//set super secret
app.set('superSecret', db.superSecret);

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//log request
app.use(morgan('dev'));


//routing
app.use(routes);




app.get('/', (req, res) => {
	res.send('Hello Wolrd!');
})

app.get('/users', (req, res) => {
	User.getAll(function(err, us)  {
		res.json(us);
	});
})

app.use('/birds', birds);
