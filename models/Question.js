const db = require('../db.js');
const errors = require('../helpers/errors');
const async = require('async');

exports.create = (question, done) => {
	const questionValues = [question.text, question.level, question.attachment];
	db.get().query('INSERT INTO question (text, level, attachment) VALUES (?, ?, ?)', questionValues, (err, res) => {
		if (err) { return done(err, null)};
		//handle categories
		question.categories = _.map(question.categories, 'id')
		for (let i = 0; i < question.categories.length; i++) {
			db.get().query('INSERT INTO question_category VALUES ('+res.insertId+', '+question.categories[i]+')', (err, res) => {
				if (err) {
					return done(err, null);
				}
			});
		}

		//add answer
		if (typeof question.answer !== 'undefined' && !_.isEmpty(question.answer)) {
			db.get().query('INSERT INTO answer (question_id, text) VALUES (?, ?)', [res.insertId, question.answer], (err, res) => {
				if (err) {
					return done(err, null);
				}
			});
		}

		//handle ANSWER
		//if the answer is String => insert new answer
		if (typeof question.answer === 'string' && question.answer !== '') {
			db.get().query('INSERT INTO answer (text) VALUES (?)', [question.answer], (err, res) => {
				if (err) {
					return done(err, null)
				}
				db.get().query('INSERT INTO question_answer (question_id, answer_id) VALUES (?,?)',
					[question.id, res.insertId], (err, res) => { if (err) { return done(err, null) }})
			});
		}
		else if (typeof question.answer === 'number') {
			db.get().query('INSERT INTO question_answer (question_id, answer_id) VALUES (?,?)',
					[res.insertId, question.answer], (err, res) => { if (err) {return done (err, null) }})
		}

		return done(null, res.insertId)
	});
};

exports.update = (question, done) => {
	const values = [question.text, question.level, question.attachment, question.id];
	db.get().query('UPDATE question SET text = ?, level = ?, attachment = ? WHERE id = ?', values, async (err, res) => {
		if (err) throw err;
		if (res.affectedRows > 0) {
			const oldCategories = [];

			await Promise.resolve(getCategoriesbyQuestionIDPromise(question.id))
			.then(result => {
				_.each(result, r => {
					oldCategories.push(r.id);
				});
				question.categories = _.map(question.categories, 'id');
			})
			
			// question.categories = _.map(question.categories, 'id');
			if (!_.isEqual(oldCategories.sort(), question.categories.sort())) {
				db.get().query('DELETE FROM question_category WHERE question_id=' + question.id, (res) => {
					for (let i = 0; i < question.categories.length; i++) {
						db.get().query('INSERT INTO question_category VALUES ('+question.id+', '+question.categories[i]+')');
					}
				});				
			}
			
			//handle ANSWER
			//if the answer is String => insert new answer
			if (typeof question.answer === 'string' && question.answer !== '') {
				db.get().query('INSERT INTO answer (text) VALUES (?)', [question.answer], (err, res) => {
					if (err) {
						return done(err, null)
					}
					db.get().query('INSERT INTO question_answer (question_id, answer_id) VALUES (?,?)',
						[question.id, res.insertId], (err, res) => { if (err) { return done(err, null) }})
				});
			}
			else if (typeof question.answer === 'number') {
				await Promise.resolve(getAnswersByQuestionIDPromise(question.id))
				.then(result => {
					_.each(result, r => {
						oldCategories.push(r.id);
					});
					question.categories = _.map(question.categories, 'id');
				})
				
				let oldAnswer = '';
				await Promise.resolve(getAnswersByQuestionIDPromise(question.id))
				.then(result => {
					oldAnswer = result;
					console.log(result);
				})
				/*if (_.isEmpty(oldAnswer)) {
					db.get().query('INSERT INTO question_answer (answer_id) VALUES (?)',
						[question.id, question.answer], (err, res) => { if (err) {return done (err, null) }})
				}
				else if (oldAnswer.indexOf(question.id) < 0) {
					db.get().query('UPDATE question_answer SET answer_id = ? WHERE question_id = ?',
						[question.answer, question.id], (err, res) => {
							if (err) {
								return done(err, null);
							}
						});
				}*/
			}
		}
		return done(null, res.affectedRows);
	});
}

exports.delete = (id, done) => {
	db.get().query('DELETE FROM question WHERE id=?', [id], (err, result) => {
		if (err) {
			done(err, null)
		}
		done(null, result.affectedRows);
	})
}

exports.getAll = async (params, done) => {
	db.get().query('SELECT q.id, q.text, q.level, q.status, a.text as answer, IF(q.attachment IS NULL OR q.attachment = \'\', 0, 1) as attachment FROM question q LEFT JOIN question_answer qa ON q.id = qa.question_id ' +
		'LEFT JOIN answer a on qa.answer_id = a.id', (err, questions) => {
			if (err) done(err);
			else done(null, questions);
		})
}

exports.getByID = (qID, done) => {
	db.get().query('SELECT q.*, qa.answer_id as answer FROM question q LEFT JOIN question_answer qa on q.id=qa.question_id WHERE q.id='+qID, async (err, questions) => {
		if (err) throw err;
		if (questions.length === 0) {
			done(null, errors.ID_NOT_FOUND(qID));
		}
		done(null, questions[0]);
	})
};

exports.getAllByCategory = (categoryId, done) => {
	db.get().query('SELEcT q.* FROM question q INNER JOIN question_category qt ON q.id=qt.question_id WHERE qt.category_id='+categoryId+
		' GROUP BY q.id', async (err, questions) => {
			if (err) throw err;
			if (questions.length === 0) {
				done(null, errors.ID_NOT_FOUND(categoryId));
			}

			for (let question of questions) {
				await Promise.resolve(getCategoriesbyQuestionIDPromise(question.id))
				.then(result => {
					question.categories = result;
				})
			}
			done(null, questions);
		});
};

exports.getRandomByCategory = (categoryId, done) => {
	db.get().query('SELEcT q.* FROM question q INNER JOIN question_category qt ON q.id=qt.question_id'+
		' WHERE qt.category_id = '+ categoryId +' ORDER BY RAND() LIMIT 1', async (err, question) => {
			if (err) throw err;
			if (question.length === 0) {
				done(null, errors.ID_NOT_FOUND(categoryId));
			}

			const categories = [];
			await Promise.resolve(getCategoriesbyQuestionIDPromise(question[0].id))
			.then(result => {
				categories = result;
			})

			question[0].categories = categories;
			done(null, question[0]);
		})
};

exports.getCategoriesForQuestion = (qID, done) => {
	db.get().query('SELECT * from category WHERE id in (SELECT category_id FROM question_category'+
		' WHERE question_id='+qID+')', (err, categories) => {
			if (err) throw err;
			if (categories.length === 0) {
				done(null, errors.ID_NOT_FOUND(qID));
			}
			done(null, categories);
		})
};

exports.getRandomQuestionByCategoryLevel = (tID, level, done) => {
	db.get().query('SELEcT q.id FROM question q INNER JOIN question_category qt ON q.id=qt.question_id'+
		' WHERE qt.category_id = '+tID+' AND q.level = '+level+' ORDER BY RAND() LIMIT 1', (err, question) => {
			if (err) {
				done(null, err);
			}
			else {
				done(question, null);
			}
		})
};

exports.getAttachmentByID = (qID, done) => {
	db.get().query('SELECT attachment FROM question WHERE id = '+qID, (err, attachment) => {
		if (err) {
			done(err, err);
		}
		else if (attachment.length === 0) {
			done(null, errors.ID_NOT_FOUND(qID));
		}
		else {
			done(null, attachment);
		}
	})
};

exports.setQuestionStatus = (id, status, done) => {
	db.get().query('UPDATE question SET status = ? WHERE id = ?', [status, id], (err, result) => {
		if (err) {
			return done(err, null);
		}
		done(null, {id: id, status: status})
	})
};

exports.getByIdWithCategories = (id, done) => {
	db.get().query('SELECT * FROM question WHERE id = ?', id, async (err, question) => {
		if (err) done(err);

		question = question[0];
		
		await Promise.resolve(getCategoriesbyQuestionIDPromise(question.id))
			.then(result => {
				question.categories = result;
			})
		done(null, question);
	});
}

function getCategoriesbyQuestionIDPromise(id) {
	const sql = 'SELECT qt.category_id as id, t.name, qt.question_id as question_id '
				+ 'FROM question_category qt LEFT JOIN category t '
		+ 'ON qt.category_ID = t.id WHERE question_id=' + id;
	return db.fetchResult(sql);
}

function getAnswersByQuestionIDPromise(id) {
	const sql = 'SELECT answer_id FROM question_answer WHERE question_id=' + id;
	return db.fetchResult(sql);
}

exports.getAllWithCategories = done => {
	db.get().query('SELECT * FROM question', async (err, questions, fields) => {
		if (err) done(err);
		
		// get category promise for each question
		let categories = [];
		_.each(questions, q => {
			categories.push(getCategoriesbyQuestionIDPromise(q.id));
		})
		
		// wait for promises to be resolved
		await Promise.all(categories)
			.then((results) => {
				_.each(results, r => {
					if (r.length > 0) {
						const qIndex = _.findIndex(questions, (q) => {
							return q.id === r[0].question_id
						});
						if (qIndex >= 0) {
							questions[qIndex].categories = r;
						}
					}
				})
			})
			.catch(errPromises => {
				console.log('ERROR IN PROMISES', errPromises);
			})

		done(null, questions);
	})
}
