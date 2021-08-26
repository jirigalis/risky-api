const logger = require('./logger');
const mysql = require('mysql');
const connectionProperties = {
	connectionLimit: 10,
	host: process.env.host,
	user: process.env.user,
	password: process.env.password,
	database: process.env.db
};
const pool = mysql.createPool(connectionProperties);
const connection = mysql.createPool(connectionProperties);

pool.on('connection', function (connection) {
	connection.on('enqueue', function (sequence) {
		if (sequence.sql) {
			logger.dbLogger.info(sequence.sql);
		}
	});
});

exports.get = function() {
	return pool;
}

exports.connect = connection;

/**
 * The global function for fetching SQL results as promises. Don't forget to use Promise.all
 * function with the await keyword to fetch all results properly. The SQL query should select 
 * also the "pairing" column to properly assing results to the parent query.
 * 
 * @param {String} sql the SQL query
 */
exports.fetchResult = async sql => {
	return await new Promise((resolve, reject) => {
		this.get().query(sql, (err, rows) => {
			if (err) {
				reject(err);
			} else {
				resolve(rows);
			}
		});
	});
}