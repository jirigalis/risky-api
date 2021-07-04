const winston = require('winston');
const expressWinston = require('express-winston');
const appRoot = require('app-root-path');


const appLogOptions = generateLogOptions('app.log');
const errLogOptions = generateLogOptions('err.log');
const dbLogger = winston.createLogger(generateLogOptions('db.log', false));

exports.appLogger = expressWinston.logger(appLogOptions);
exports.errLogger = expressWinston.errorLogger(errLogOptions);
exports.dbLogger = dbLogger;

function generateLogOptions(file, useConsole = true) {
    const transports = [
        new winston.transports.File({
            level: 'debug',
            filename: `${appRoot}/log/${file}`,
            handleExceptions: true,
            json: true,
            maxFiles: 10,
            maxsize: 5242880,
            colorize: false
        })
    ];

    if (useConsole) {
        transports.push(new winston.transports.Console());
    }
    
    return {
        transports: transports,
        meta: false,
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
        )
    }
}