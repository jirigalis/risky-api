require('dotenv').config();
global._ = require('lodash');
global.moment = require('moment');
global.errors = require('./helpers/errors');
global.utils = require('./helpers/utils');

const express = require('express')
const app = express();
const routes = require('./controllers/index');
const expressSanitizer = require('express-sanitizer');
const winston = require('winston'),
    expressWinston = require('express-winston');
const appRoot = require('app-root-path');
const logger = require('./logger');

//set super secret
app.set('superSecret', process.env.secret);

// use parser so we can get info from POST and/or URL parameters
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: true }));
app.use(expressSanitizer());

//log request
app.use(logger.appLogger);
app.use(logger.errLogger);

//static files
app.use('*/public', express.static('public'));

//routing
app.use(routes);

app.listen(3000, () => console.log('Listening on port 3000...'))		


