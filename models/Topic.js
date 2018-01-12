var db = require('../db.js');

exports.create = function(topic, done) {
	var values = [topic.name, topic.description];
	db.get().query('INSERT INTO topic (name, description) VALUES (?, ?)', values, function (err, result) {
		if (err) throw err;
		done(null, result.insertId)
	});
}

exports.getAll = function(done) {
	db.get().query('SELECT * FROM topic ORDER BY name', function (err, rows) {
		if (err) throw err;
		done(null, rows);
	});
}

exports.getByName = (name, done) => {
	db.get().query('SELECT * FROM topic WHERE name like "%'+name+'%"', (err, rows) => {
		if (err) throw err;
		done(null, rows);
	});
}

exports.getByID = (id, done) => {
	db.get().query('SELECT * FROM topic WHERE id='+id, (err, rows) => {
		if (err) throw err;
		done(null, rows[0]);
	});
}