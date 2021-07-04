const db = require('../db.js');

exports.getAll = getAll;
exports.getByID = getByID;
exports.getByQuestion = getByQuestionID;
exports.create = create;
exports.update = update;
exports.remove = remove;

function getAll(done) {
    db.get().query('SELECT * FROM answer ORDER BY text', (err, answers) => {
        if (err) {
            done(err, null);
        }
        done(null, answers)
    })
}

function getByID(id, done) {
    db.get().query('SELECT * FROM answer WHERE id='+id, (err, answer) => {
        if (err) {
            done(err, null);
        }
        if (answer.length == 0) {
            done(null, errors.ID_NOT_FOUND(id))
        }
        done(null, answer[0])
    })
}

function getByQuestionID(qID, done) {
    db.get().query('SELECT * FROM answer where question_id ='+qID, (err, answers) => {
        if (err) {
            return done(err, null);
        }
        return done(null, answers);
    })
}

function create(answer, done) {
    var answerValues = [answer.question_id, answer.text];
    db.get().query('INSERT INTO answer (question_id, text) VALUES (?, ?)', answerValues, (err, res) => {
        if (err) {
            done(err, null)
        }
        done(null, res.insertId);
    })
}

function update(answer, done) {
    var answerValues = [answer.question_id, answer.text, answer.id];
    db.get().query('UPDATE answer SET question_id = ?, text = ? WHERE id = ?', answerValues, (err, res) => {
        if (err) {
            return done(err, null)
        }
        return done(null, res.affectedRows);
    })
}

function remove(id, done) {
    db.get().query('DELETE FROM answer WHERE id='+id, (err, res) => {
        if (err) {
            return done(err, null)
        }
        return done(null, res.affectedRows);
    })
}
