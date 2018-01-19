var db = require('../db.js');

exports.create = (question, done) => {
	var questionValues = [question.text, question.level, question.attachment];
	db.get().query('INSERT INTO question (text, level, attachment) VALUES (?, ?, ?)', questionValues, (err, res) => {
		if (err) throw err;
		db.get().query('INSERT INTO question_topic VALUES ('+res.insertId+', '+question.topic+')', (err2, res2) => {
			if (err) throw err2;			
		})
		return done(null, res.insertId)
	});
}

exports.update = (question, done) => {
	var values = [question.text, question.level, question.attachment, question.id];
	db.get().query();
}

async function fetchTopics(questions) {
	questions.forEach((row, index, questions) => {
		questions[index].topics = "";
		fetchTopicsByQuestionID(row.id).then(ress => {
			console.log(ress);
		});
	});
	console.log(questions);
	return questions;
}

exports.getAll = (done) => {
	db.get().query('SELECT * FROM question', (err, rows) => {
		if (err) throw err;
		//get topics

		fetchTopics(rows).then(data => {
			console.log("=====================");
			console.log(data);
			console.log("=====================");
		});
		console.log('____________');
		return done(null, rows)
	})
}

async function fetchTopicsByQuestionID(qID) {
	db.get().query('SELECT * from question_topic WHERE topic_id='+qID, (err, rows) => {
		if (err) throw err;
		console.log(rows);
		return rows
	})
}