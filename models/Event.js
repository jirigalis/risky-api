var db = require('../db.js');

exports.getAll = getAll;
exports.getByID = getByID;


function getAll(done) {
	db.get().query('SELECT * FROM event', (err, events) => {
		if (err) throw err;
		return done(null, events);
	})
}

function getByID(id, done) {
	db.get().query('SELECT * FROM event WHERE id='+id, (err, event) => {
		if (err) throw err;
		if (event.length === 0) {
			return done(null, errors.ID_NOT_FOUND(id));
		}
		return done(null, event[0]);
	})
}

function create(event, done) {
	var eventValues = [event.author, event.created, event.updated, event.state];
	db.get().query('INSERT INTO event (author, created, updated, state) VALUES (?,?,?,?)', eventValues, (err, res) => {
		if (err) throw err;
		return done(null, res.insertId)
	})
}

