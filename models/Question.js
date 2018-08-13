var db = require('../db.js');
var errors = require('../helpers/errors');

exports.create = (question, done) => {
	var questionValues = [question.text, question.level, question.attachment];
	db.get().query('INSERT INTO question (text, level, attachment) VALUES (?, ?, ?)', questionValues, (err, res) => {
		if (err) { return done(err, null)};
		//handle topics
		question.topics = _.map(question.topics, parseFloat)
		for (var i = 0; i < question.topics.length; i++) {
			db.get().query('INSERT INTO question_topic VALUES ('+res.insertId+', '+question.topics[i]+')', (err, res) => {
				if (err) {
					return done(err, null);
				}
			});
		}

		//add answer
		if (typeof question.answer !== undefined && question.answer !== "") {
			db.get().query('INSERT INTO answer (question_id, text) VALUES (?, ?)', [res.insertId, question.answer], (err, res) => {
				if (err) {
					return done(err, null);
				}
			});
		}

		return done(null, res.insertId)
	});
}

exports.update = (question, done) => {
	var values = [question.text, question.level, question.attachment, question.id];
	db.get().query('UPDATE question SET text = ?, level = ?, attachment = ? WHERE id = ?', values, async (err, res) => {
		if (err) throw err;
		if (res.affectedRows > 0) {
			let oldTopics = await fetchTopicsByQuestionID(question.id);
			question.topics = _.map(question.topics, parseFloat)
			if (!_.isEqual(oldTopics.sort(), question.topics.sort())) {
				db.get().query('DELETE FROM question_topic WHERE question_id='+question.id);
				//TODO: find out why some ids are not added sometimes.
				//edit: at first edit topics are cleared
				for (var i = 0; i < question.topics.length; i++) {
					db.get().query('INSERT INTO question_topic VALUES ('+question.id+', '+question.topics[i]+')');
				}
			}

			//update answer
			let oldAnswer = await fetchAnswerByQuestionID(question.id);
			if (_.isEmpty(oldAnswer)) {
				db.get().query('INSERT INTO answer (question_id, text) VALUES (?,?)', [question.id, question.answer], (err, res) => {
					if (err) {
						return done(err, null);
					}
				});
			}
			if (!_.isEqual(oldAnswer, question.answer)) {
				db.get().query('UPDATE answer SET text = ? WHERE question_id = ?', [question.answer, question.id])
			}
		}
		return done(null, res.affectedRows);
	});
}

exports.getAll = async (params, done) => {
	const offset = params.page * params.limit;
	db.get().query('SELECT q.id, q.text, q.level, a.text as answer FROM `question` q LEFT JOIN answer a on q.id = a.question_id', async (err, questions) => {
		if (err) throw err;
		for (let question of questions) {
			const topics = await fetchTopicsByQuestionID(question.id);
			question.topics = topics
		}
		return done(null, questions)
	})
}

exports.getByID = (qID, done) => {
	db.get().query('SELECT q.*, a.text as answer FROM question q LEFT JOIN answer a on q.id=a.question_id WHERE q.id='+qID, async (err, questions) => {
		if (err) throw err;
		if (questions.length === 0) {
			return done(null, errors.ID_NOT_FOUND(qID));
		}
		const topics = await fetchTopicsByQuestionID(questions[0].id);
		questions[0].topics = topics;
		return done(null, questions[0]);
	})
}

exports.getAllByTopicID = (tID, done) => {
	db.get().query('SELEcT q.* FROM question q INNER JOIN question_topic qt ON q.id=qt.question_id WHERE qt.topic_id='+tID+
		' GROUP BY q.id', async (err, questions) => {
			if (err) throw err;
			if (questions.length === 0) {
				return done(null, errors.ID_NOT_FOUND(tID));
			}

			for (let question of questions) {
				const topics = await fetchTopicsByQuestionID(question.id);
				question.topics = topics;
			}
			return done(null, questions);
		});
}

exports.getRandomByTopic = (tID, done) => {
	db.get().query('SELEcT q.* FROM question q INNER JOIN question_topic qt ON q.id=qt.question_id'+
		' WHERE qt.topic_id = '+tID+' ORDER BY RAND() LIMIT 1', async (err, question) => {
			if (err) throw err;
			if (question.length === 0) {
				return done(null, errors.ID_NOT_FOUND(tID));
			}

			const topics = await fetchTopicsByQuestionID(question[0].id);
			question[0].topics = topics;
			return done(null, question[0]);
		})
}

exports.getTopics = (qID, done) => {
	db.get().query('SELECT * from topic WHERE id in (SELECT topic_id FROM question_topic'+
		' WHERE question_id='+qID+')', (err, topics) => {
			if (err) throw err;
			if (topics.length === 0) {
				return done(null, errors.ID_NOT_FOUND(qID));
			}
			return done(null, topics);
		})
}

exports.getRandomQuestionByTopicLevel = (tID, level, done) => {
	db.get().query('SELEcT q.id FROM question q INNER JOIN question_topic qt ON q.id=qt.question_id'+
		' WHERE qt.topic_id = '+tID+' AND q.level = '+level+' ORDER BY RAND() LIMIT 1', (err, question) => {
			console.log(question);
			console.log("question");
			if (err) {
				return done(null, err);
			}
			else {
				return done(question, null);
			}
		})
}

exports.getAttachmentByID = (qID, done) => {
	db.get().query('SELECT attachment FROM question WHERE id = '+qID, (err, attachment) => {
		if (err) {
			return done(err, err);
		}
		else if (attachment.length == 0) {
			return done(null, errors.ID_NOT_FOUND(qID));
		}
		else {
			return done(null, attachment);
		}
	})
}

async function fetchTopicsByQuestionID(qID) {
	let topics = await Promise.resolve(db.get().query('SELECT topic_id from question_topic WHERE question_id='+qID));
	return _.map(topics, 'topic_id');
}

async function fetchAnswerByQuestionID(qID) {
	let answer  = await Promise.resolve(db.get().query('SELECT text FROM answer WHERE question_id='+qID));
	return answer;
}