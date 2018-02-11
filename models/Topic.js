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
	console.log(id);
	db.get().query('SELECT * FROM topic WHERE id='+id, (err, rows) => {
		if (err) throw err;
		done(null, rows[0]);
	});
}

exports.update = (topic, done) => {
	var values = [topic.name, topic.description, topic.id];
	db.get().query('UPDATE topic SET name = ?, description = ? WHERE id = ?', values, (err, result) => {
		if (err) throw err;
		done(null, result.affectedRows);
	})
}
exports.delete = (id, done) => {
	db.get().query('DELETE FROM topic WHERE id=?',[id], (err, result) => {
		if (err) throw err;
		done(null, result.affectedRows);
	})
}

exports.getByQuestionId = (qID, done) => {
	db.get().query('SELECT * from topic WHERE id in (SELECT topic_id FROM question_topic'+
	' WHERE question_id='+qID+')', (err, topics) => {
		if (err) throw err;
		console.log(topics);
		if (topics.length === 0) {
			return done(null, errors.ID_NOT_FOUND(qID));
		}
		return done(null, topics);
	})
}