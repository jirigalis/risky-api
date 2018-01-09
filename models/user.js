var db = require('../db.js');

exports.create = function(userId, login, name, password, done) {
	var values = [userId, login, name, password];

	db.get().query('INSERT INTO user (login, name, password) VALUES (?, ?, ?)', values, function (err, result) {
		if (err) return done(err);
		done(null, result.insertId)
	});
}

exports.getAll = function(done) {
	db.get().query('SELECT * FROM user', function (err, rows) {
		if (err) return done(err);
		done(null, rows);
	});
}

exports.getById = function (userId, done) {
	db.get().query('SELECT * FROM user WHERE id=?', userId, function(err, rows) {
		if (err) return done(err);
		done(null, rows);
	})
}

exports.getByLogin = function (login, done) {
	db.get().query('SELECT * FROM user WHERE login=?', login, function(err, rows) {
		if (err) return done(err);
		done(null, rows[0]);
	})
}