var mysql = require('mysql');
var pool;

exports.superSecret = 'ilovescotchyscotch';
exports.connect = function(done) {
	pool = mysql.createPool({
		connectionLimit : 10,
		host: 'localhost',
		user: 'jgalis',
		password: 'root',
		database: 'risky'
	})


	pool.getConnection(function (err, connection) {
		console.log("Connected to DB")
		connection.on('error', err => {
			console.log("---------------------------------------");
			console.log(err);
			console.log("---------------------------------------");
		})
	});

	done()
}

exports.get = function() {
	return pool;
}