var db = require('../db.js');

exports.getAll = function(done) {
	db.get().query('SELECT * FROM competitor ORDER BY name', function (err, rows) {
		done(err, rows);
	});
}

exports.getByID = (id, done) => {
	db.get().query('SELECT * FROM competitor WHERE id='+id, (err, rows) => {
		if (err) done(err, null);
		done(null, rows[0]);
	});
}

exports.create = function(competitor, done) {
	var values = [competitor.name, moment().unix(), competitor.note];
	db.get().query('INSERT INTO competitor (name, created, note) VALUES (?, ?, ?)', values, function (err, result) {
		if (err) {done(err, err);}
		done(null, result.insertId)
	});
}

exports.update = (competitor, done) => {
	var values = [competitor.name, competitor.note, competitor.id];
	db.get().query('UPDATE competitor SET name = ?, note = ? WHERE id = ?', values, (err, result) => {
		if (err) done(err, err);
		done(null, result.affectedRows);
	})
}

exports.delete = (id, done) => {
	db.get().query('DELETE FROM competitor WHERE id=?',[id], (err, result) => {
		if (err) { return done(err, err) };
		done(null, result.affectedRows);
	})
}