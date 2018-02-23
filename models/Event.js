var db = require('../db.js');

exports.getAll = getAll;
exports.getByID = getByID;
exports.create = create;
exports.remove = remove;

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
	db.get().query('INSERT INTO evsent (author, created, updated, state) VALUES (?,?,?,?)', eventValues, (err, res) => {
		if (err) return done(err, null);
		
		const id = res.insertId;

		//insert competitors
		/*_.forEach(event.competitors, c => {
			db.get().query('INSERT INTO event_competitor (event_id, competitor_id) VALUES (?, ?)', [id, c], (err, res) => {
				if (err) return done(err, err);
			})
		})

		//insert questions
		_.forEach(event.questions, q => {
			db.get().query('INSERT INTO event_question (event_id, question_id) VALUES (?, ?)', [id, q], (err, res) => {
				if (err) return done(err, err);
			})
		})*/

		return done(null, res.insertId)
	})
}

function update(event, done) {

}

function remove(id, done) {
	db.get().query('DELETE FROM event WHERE id='+id, (err, res) => {
		if (err) return done(err, err);
		return done(null, res)
	});
}

