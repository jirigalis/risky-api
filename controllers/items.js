const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const multer = require('multer');
const utils = require('../helpers/utils');
const fs = require('fs');
const errors = require('../helpers/errors');
const TMP_FILE_PATH = './public/tmp/';
const UPLOADS_PATH = './public/uploads/';
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, TMP_FILE_PATH)
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
});

const upload = multer({ storage: storage });

router.get('/', getAll);
router.get('/:id', getByID);
router.post('/new', upload.single('file'), create);
router.put('/update/:id', upload.single('file'), update);
router.delete('/delete/:id', remove);

module.exports = router;

function getAll(req, res, next) {
    Item.getAll((err, answers) => {
        if (err) {
            next(err);
        }
        res.json(answers);
    })
}

function getByID(req, res, next) {
    Item.getByID(req.params.id, (err, answer) => {
        if (err) {
            next(err);
        }
        res.json(answer);
    })
}

function create(req, res, next) {
    const itemJson = JSON.parse(req.body.item);
    const newItem = {
        name: req.sanitize(itemJson.name),
        latin_name: req.sanitize(itemJson.latin_name),
        description: req.sanitize(itemJson.description),
        level: req.sanitize(itemJson.level),
        categories: itemJson.categories,
        file: req.file
    }

    if (utils.isNullOrEmpty(newItem.name)) {
        return next(errors.NULL_OR_EMPTY('name'));
    }

    if (utils.isNullOrEmpty(newItem.file)) {
        return next(errors.NULL_OR_EMPTY('file'))
    }

    if (utils.isNullOrEmpty(newItem.categories)) {
        return next(errors.NULL_OR_EMPTY('categories'))
    }
    
    Item.create(newItem, (err, insertedItem) => {
        if (err) {
            next(err);
        } else {
            const tmpItemPath = TMP_FILE_PATH + newItem.file.filename;
            const newItemPath = UPLOADS_PATH + newItem.categories[0].id + '/';

            console.log("Item paths", tmpItemPath, newItemPath);
            
            if (!fs.existsSync(newItemPath)) {
                fs.mkdir(newItemPath, { recursive: true }, (err) => {
                    if (err) throw err;
                });
            }

            fs.rename(tmpItemPath, newItemPath + insertedItem + '.png', (err) => {
                if (err) {
                    next(err);
                }

                Item.addPhoto({ name: newItemPath + insertedItem + '.png', id: insertedItem }, (err) => {
                    if (err) {
                        console.log(err);
                        res.status(400).send(err);
                        return;
                    }
                });
            });
            res.json(insertedItem);
        }
    })
}

function update(req, res, next) {
    const itemJson = JSON.parse(req.body.item);
    const item = {
        id: parseInt(req.params.id),
        name: req.sanitize(itemJson.name),
        latin_name: req.sanitize(itemJson.latin_name),
        level: parseInt(req.sanitize(itemJson.level)),
        categories: itemJson.categories,
        description: req.sanitize(itemJson.description),
        file: req.file
    }

    if (utils.isNullOrEmpty(item.name)) {
        next(errors.NULL_OR_EMPTY('name'));
    }

    if (utils.isNullOrEmpty(item.level)) {
        next(errors.NULL_OR_EMPTY('level'));
    }

    if (utils.isNullOrEmpty(item.categories)) {
        next(errors.NULL_OR_EMPTY('categories'));
    }
    
    Item.getByID(item.id, (err, oldItem) => {
        let changed = false;    

        // compare basic properties
        if (oldItem.name !== item.name 
            || (oldItem.latin_name !== item.latin_name && !utils.isUndefined(item.latin_name))
            || oldItem.level !== item.level) {
            changed = true;
        }

        // compare description
        if (oldItem.description !== item.description && (oldItem.description !== null && !utils.isUndefined(item.description))) {
            changed = true;
        }

        if (item.file) {
            changed = true;
        }

        if (utils.compareCategories(oldItem.categories, item.categories)) {
            changed = true;
        }

        if (changed) {
            Item.update(item, (err, updatedItem) => {        
                if (err) {
                    next(err);
                } else {
                    if (!utils.isUndefined(item.file)) {
                        const tmpItemPath = TMP_FILE_PATH + item.file.filename;
                        const newItemPath = UPLOADS_PATH + item.categories[0].id + '/';
                        const newFullItemPath = newItemPath + item.id + '.png';

                        // create new folder if not exists
                        if (!fs.existsSync(newItemPath)) {
                            fs.mkdir(newItemPath, { recursive: true }, err => {
                                if (err) next(err);
                            });
                        }

                        fs.rename(tmpItemPath, newFullItemPath, err => {
                            if (err) {
                                next(err);
                            }
                            const updated = { name: newFullItemPath, id: updatedItem };
                            Item.updatePhoto({ name: newFullItemPath, id: updatedItem }, (err) => {
                                if (err) {
                                    res.status(400).send(err);
                                    return;
                                }
                            });
                        });
                    }
                    res.json(updatedItem);
                }
            })
        } else {
            res.json(1);
        }
    });
}

function remove(req, res, next) {
    Item.remove(req.params.id, (err, deleted) => {
        if (err) {
            next(err);
        }
        res.json(deleted)
    })
}