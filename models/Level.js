var db = require('../db.js');

exports.getAll = getAll;
exports.getByID = getByID;

function getAll(done) {
    db.get().query('SELECT * FROM level', (err, events) => {
		if (err) throw err;
		return done(null, events);
	})
}

function getByID(id, done) {
    db.get().query('SELECT * FROM level WHERE id='+id, (err, level) => {
        if (err) throw err;
        if (level.length === 0) {
            return done(null, errors.ID_NOT_FOUND(id))
        }
        return done(null, level[0])
    })
}