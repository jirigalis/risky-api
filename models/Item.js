const db = require('../db.js');
const errors = require('../helpers/errors.js');

exports.getAll = getAll;
exports.getByID = getByID;
exports.create = create;
exports.update = update;
exports.remove = remove;
exports.addPhoto = addPhoto;
exports.updatePhoto = updatePhoto;

function getAll(done) {
    db.get().query('SELECT * FROM item', (err, items) => {
        if (err) {
            done(err, null);
        } else {
            done(null, items)
        }
    })
}

function getByID(id, done) {
    db.get().query('SELECT i.*, p.filename FROM item i LEFT JOIN photo p ON i.id = p.item_id WHERE i.id='+id, async (err, item) => {
        if (err) {
            return done(err, null);
        }
        if (item.length == 0) {
            return done(null, errors.ID_NOT_FOUND(id))
        }

        item = item[0];
        await Promise.resolve(getCategoriesbyItemIDPromise(item.id))
			.then(result => {
				item.categories = result;
			})
        done(null, item);
    })
}

function getCategoriesbyItemIDPromise(id) {
	const sql = 'SELECT ic.category_id as id, c.name, ic.item_id as item_id '
				+ 'FROM item_category ic LEFT JOIN category c '
		+ 'ON ic.category_id = c.id WHERE item_id=' + id;
	return db.fetchResult(sql);
}

async function create(item, done) {
    var itemValues = [item.name, item.latin_name, item.description, item.level];

    const sql = 'SELECT id FROM item WHERE name LIKE \'' + item.name + '\'';
    let duplicateErr = false;
    await Promise.resolve(db.fetchResult(sql))
        .then(result => {
            if (!_.isEmpty(result)) {
                duplicateErr = true;
            }
        })
    
    if (duplicateErr) {
        return done(errors.DUPLICATE_ENTRY('name', item.name));
    }

    db.get().query('INSERT INTO item (name, latin_name, description, level) VALUES (?, ?, ?, ?)', itemValues, (err, res) => {
        if (err) {
            console.log(err);
            done(err, null);
        } else {
            _.each(item.categories, category => {
                db.get().query('INSERT INTO item_category (item_id, category_id) VALUES (?, ?)', [res.insertId, category.id], (err, res2 => {
                    console.log('Insert Categories', category);
                    if (err) {
                        done(err);
                    } else {
                        
                    }
                }))
            })

            done(null, res.insertId);
        }
    })
}

async function update(item, done) {
    var itemValues = [item.name, item.latin_name, item.description, item.level, item.id];
    
    const sql = 'SELECT id FROM item WHERE name LIKE \'' + item.name + '\' AND id != item.id';
    let duplicateErr = false;
    await Promise.resolve(db.fetchResult(sql))
        .then(result => {
            if (!_.isEmpty(result)) {
                duplicateErr = true;
            }
        });
    
    if (duplicateErr) {
        return done(errors.DUPLICATE_ENTRY('name', item.name));
    } else {
        db.get().query('UPDATE item SET name = ?, latin_name = ?, description = ?, level = ? WHERE id = ?', itemValues, (err, res) => {
            if (err) {
                return done(err, null)
            }

            _.each(item.categories, category => {
                db.get().query('DELETE FROM item_category WHERE item_id = ?', [item.id], (err, res => {
                    if (err) {
                        return done(err);
                    }

                    db.get().query('INSERT INTO item_category (item_id, category_id) VALUES (?, ?)', [item.id, category.id], (err, res2 => {
                        console.log('Insert Categories', category);
                        if (err) {
                            return done(err);
                        }
                    }))
                }))
            })

            done(null, res.affectedRows);
        })
    }
}

function remove(id, done) {
    db.get().query('DELETE FROM item WHERE id=' + id, (err, res) => {
        if (err) {
            done(err, null)
        }        
        db.get().query('DELETE FROM item_category WHERE item_id=' + id, (err2, res2) => {
            if (err2) {
                done(err2, null)
            }
            db.get().query('DELETE FROM photo WHERE item_id=' + id, (err3, res3) => {
                if (err3) {
                    done(err3);
                }
                done(null, res.affectedRows);
            })
        });
    })
}

function addPhoto(file, done) {
    db.get().query('INSERT INTO photo (filename, item_id) VALUES (?, ?)', [file.name, file.id], (err, res) => {
        if (err) {
            return done(err)
        } else {
            return done(null, res.insertId)
        }
    })
}

function updatePhoto(file, done) {
    db.get().query('UPDATE photo SET filename = ? WHERE item_id = ?', [file.name, file.id], (err, res) => {
        if (err) {
            return done(err);
        }
        return done(null, res.insertId);
    })
}

function updateCategories(itemId, categories) {
    db.get().query('DELETE FROM item_category WHERE item_id')
    
    _.each(categories, category => {

    })
}