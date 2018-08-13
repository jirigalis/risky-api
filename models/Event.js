var db = require('../db.js');
var Question = require('../models/Question');

exports.getAll = getAll;
exports.getByID = getByID;
exports.play = play;
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

/**
 * Create new Risky Event
 * 1. Create Event in database
 * 
 * @param {Event} event 
 * @param {function} done 
 */
function create(event, done) {
	var eventValues = [event.author, event.created, event.updated, event.state];
	event.questions = [];		

	db.get().query('INSERT INTO event (author, created, updated, state) VALUES (?,?,?,?)', eventValues, (err, res) => {
		if (err) return done(err, null);
		
		const id = res.insertId;

		//insert competitors
		_.forEach(event.competitors, c => {
			db.get().query('INSERT INTO event_competitor (event_id, competitor_id) VALUES (?, ?)', [id, c], (err, res) => {
				if (err) return done(err, null);
			})
		})

		//insert questions
		_.forEach(event.topics, tID => {
			for (var i = 1; i <= event.questionCount; i++) {
				//find random question for each topic
				Question.getRandomQuestionByTopicLevel(tID, i, (question, err) => {
					console.log(question);
					db.get().query('INSERT INTO event_question (event_id, topic_id, question_id) VALUES (?, ?, ?)', [id, tID, question[0].id], (err, res) => {
						if (err) return done(err, null);
					})
				})
			}			
			
		})

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

function play(id, done) {
	db.get().query('SELECT * FROM event WHERE id='+id, async (err, event) => {
		if (err) {
			return done(err, null)
		}

		event = event[0];

		let competitors = await fetchCompetitors(event.id);
		let questions = await fetchQuestions(event.id);

		event.competitors = competitors;
		event.questions = questions;

		return done(null, event);
	})
}

async function fetchCompetitors(eID) {
	let competitors  = await Promise.resolve(db.get().query('SELECT competitor_id FROM event_competitor WHERE event_id='+eID));
	return _.map(competitors, 'competitor_id');
}

async function fetchQuestions(eID) {
	let questions = await Promise.resolve(db.get().query('SELECT question_id FROM event_question WHERE event_id='+eID));

	questions = _.map(questions, 'question_id');

	_.map(questions, async q => {
		let topics = await Promise.resolve(db.get().query('SELECT topic_id from question_topic WHERE question_id='+q));
		q = {
			topic: topics,
			question: q
		}
	});

	console.log(questions);

	return questions;
}