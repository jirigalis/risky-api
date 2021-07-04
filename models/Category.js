const db = require('../db.js');

exports.create = (category, done) => {
    var values = [category.name, category.description, category.status, category.img];
    
    db.get().query('INSERT INTO category (name, description, status, img) VALUES (?, ?, ?, ?)', values, (err, rows) => {
		if (err) done(err);
		else done(null, rows);
	})
};

exports.getAll = (done) => {
	db.get().query(
		'SELECT id, name, description, status, convert(img using utf8) as img FROM category ORDER BY name',
		(err, rows) => {
			if (err) done(err);
			else done(null, rows);
		})
};

exports.getAllList = function(done) {
    db.get().query('SELECT id, name FROM category ORDER BY id',(err, rows) => {
		if (err) done(err);
		else done(null, rows);
	})
};

exports.getAllWithStats = function(done) {    
	db.get().query('SELECT ' +
		'c.id, c.name, c.description, c.status, ' +
		'CONVERT(c.img using utf8) AS img, COUNT(ic.item_id) AS item_count FROM category c' +
		' LEFT JOIN item_category ic ON c.id = ic.category_id GROUP BY c.id',
		(err, rows) => {
			if (err) done(err);
			else { done(null, rows); }
		})
};

exports.getByName = (name, done) => {
	db.get().query('SELECT * FROM category WHERE name like "%' + name + '%"',
		(err, rows) => {
			if (err) done(err);
			else done(null, rows);
		})
};

exports.getByID = (id, done) => {
	db.get().query('SELECT id, name, description, status, convert(img using utf8) as img FROM category WHERE id=' + id,
		(err, rows) => {
			if (err) done(err);
			else done(null, rows[0]);
		})
};

exports.getItemThumbnails = (id, count, done) => {
	db.get().query('SELECT ' +
		'i.id, i.name, i.latin_name, i.level, p.filename ' +
		'FROM `item` i LEFT JOIN item_category ic ON i.id = ic.item_id LEFT JOIN photo p on i.id = p.item_id ' +
		'WHERE ic.category_id = ? ORDER BY RAND() LIMIT ?', [id, count], (err, rows) => {
		if (err) {
			return done(err);
		} else {
			return done(null, rows);
		}
	});
}

exports.update = (category, done) => {
    const values = [category.name, category.description, category.img, category.status, category.id];
	db.get().query('UPDATE category SET name = ?, description = ?, img = ?, status = ? WHERE id = ?', values,
		(err, rows) => {
			if (err) done(err);
			else done(null, {id: category.id, name: category.name, description: category.description, status: category.status});
		})
};

exports.setCategoryStatus = (id, status, done) => {
	db.get().query('UPDATE category SET status = ? WHERE id = ?', [status, id],
		(err, rows) => {
		if (err) done(err);
		else done(null, {id: id, status: status});
	})
};

exports.delete = (id, done) => {
    db.get().query('DELETE FROM category WHERE id=?', id, (err, rows) => {
		if (err) done(err);
		else done(null, rows.affectedRows);		
	})
};

exports.getByQuestionId = (qID, done) => {
    db.get().query('SELECT * from category WHERE id in (SELECT category_id FROM question_category' +
        ' WHERE question_id=' + qID + ')', (err, rows) => {
			if (err) done(err);
			if (rows.length === 0) {
				done(null, errors.ID_NOT_FOUND(qID));
			}
			done(null, rows.affectedRows);
	})
}

exports.checkOtherNameExists = (id, name, done) => {
	db.get().query('SELECT name FROM `category` WHERE name LIKE "' + name + '" AND name NOT IN (SELECT name FROM category WHERE id = ' + id + ')',
		(err, rows) => {
		if (err) done(err);
		else done(null, rows.length);
	})
}
