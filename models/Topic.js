var db = require('../db.js');

exports.create = (topic) => {
    var values = [topic.name, topic.description, topic.img];
	return db.get().query('INSERT INTO topic (name, description, img) VALUES (?, ?, ?)', values);
}

exports.getAll = function() {
    return db.get().query('SELECT id, name, description, convert(img using utf8) as img FROM topic ORDER BY name');
}

exports.getAllWithStats = function() {
	return db.get().query(
		'select t.id, t.name, t.description, t.status, convert(t.img using utf8) as img, count(qt.question_id) as question_count from topic t left join question_topic qt on t.id =qt.topic_id group by t.id'
	);
}

exports.getByName = (name) => {
    return db.get().query('SELECT * FROM topic WHERE name like "%' + name + '%"');
}

exports.getByID = (id, done) => {
    console.log(id);
    db.get().query('SELECT * FROM topic WHERE id=' + id, (err, rows) => {
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
    db.get().query('DELETE FROM topic WHERE id=?', [id], (err, result) => {
        if (err) {
            return done(err, null)
        };
        done(null, result.affectedRows);
    })
}

exports.getByQuestionId = (qID, done) => {
    db.get().query('SELECT * from topic WHERE id in (SELECT topic_id FROM question_topic' +
        ' WHERE question_id=' + qID + ')', (err, topics) => {
            if (err) throw err;
            if (topics.length === 0) {
                return done(null, errors.ID_NOT_FOUND(qID));
            }
            return done(null, topics);
        })
}