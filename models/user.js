var db = require('../db.js');

exports.create = function (user, done) {
	var values = [user.email, user.firstname, user.lastname, user.password, user.salt,  user.role];
	db.get().query('INSERT INTO user (email, firstname, lastname, password, salt, role) VALUES (?, ?, ?, ?, ?, ?)', values, (err, result) => {
		if (err) done(err);
		else done(null, result.insertId);
	})
}

exports.getAll = function(done) {
	db.get().query('SELECT * FROM user', (err, rows) => {
		if (err) done(err);
		else done(null, rows);
	})
}

exports.getAllWithRoles = (done) => {
	db.get().query('SELECT u.id, u.firstname, u.lastname, u.email, r.name as role  FROM user u LEFT JOIN role r ON u.role = r.id', (err, rows) => {
		if (err) done(err);
		else done(null, rows);
	})
}

exports.getById = function (userId, done) {
	db.get().query('SELECT id, firstname, lastname, email, role FROM user WHERE id=?', userId, (err, rows) => {
		if (err) done(err);
		else done(null, rows[0]);
	})
}

exports.getByEmail = function (email, done) {
	db.get().query('SELECT * FROM user WHERE email=?', [email], (err, rows) => {
		if (err) {
			done(err);
		}
		done(null, rows[0]);
	});
}

exports.update = (user, done) => {
	db.get().query('SELECT * FROM user WHERE id = ?', user.id, (err, oldUser) => {
		if (oldUser.length > 0) {
			let updateQuery = 'UPDATE user SET ';
			let updateValuesArr = [];
			oldUser = oldUser[0];
			console.log(oldUser);
			
			if (oldUser.firstname != user.firstname) {
				updateQuery += 'firstname = ?, ';
				updateValuesArr.push(user.firstname);
			}

			if (oldUser.lastname != user.lastname) {
				updateQuery += 'lastname = ?, ';
				updateValuesArr.push(user.lastname);
			}

			if (oldUser.email != user.email) {
				updateQuery += 'email = ?, ';
				updateValuesArr.push(user.email);
			}

			if (typeof user.password !== 'undefined' && oldUser.password != user.password) {
				updateQuery += 'password = ?, ';
				updateValuesArr.push(user.password);
			}

			if (oldUser.role != user.role) {
				updateQuery += 'role = ?, ';
				updateValuesArr.push(user.role);
			}

			if (updateQuery.substr(updateQuery.length - 2) === ', ') {
				updateQuery = updateQuery.substr(0, updateQuery.length - 2);
			}

			updateQuery += ' WHERE id = ' + user.id;

			console.log(updateQuery);

			if (updateValuesArr.length === 0) {
				return done(null, 0);
			}

			db.get().query(updateQuery, updateValuesArr, (err, rows) => {
				if (err) {
					done(err);
				} else {
					done(null, rows.affectedRows);
				}
			})
		} else {
			done(null, 0);
		}
	});
}

exports.delete = (id, done) => {
	db.get().query('DELETE FROM user WHERE id = ?', id, (err, rows) => {
		if (err) {
			done(err)
		} else {
			done(null, rows);
		}
	})
}

exports.checkUserExists = (email, done) => {
	db.get().query('SELECT id FROM user WHERE email = ?', email, (err, rows) => {
		if (err) {
			done(err)
		} else {
			done(null, rows.length)
		}
	})
}

exports.checkOtherUserExists = (id, email, done) => {
	db.get().query('SELECT id FROM `user` WHERE email = \'?\' AND id != ?', [email, id], (err, rows) => {
		if (err) done(err);
		else done(null, rows.length);
	})
}