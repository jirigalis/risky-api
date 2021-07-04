const express = require('express')
const errors = require('../helpers/errors');
const router = express.Router();

const Category = require('../models/Category');

router.get('/', function (req, res, next) {
    Category.getAll((err, result) => {
        if (err) {
            next(err);
        }
        res.json(result);
    })
});

router.get('/list', getAllList);
router.get('/stats', getAllWithStats);
router.get('/:id', getById);
router.get('/:id/thumbnails', getItemThumbnails);
router.get('/question/:id', getByQuestionId);
router.post('/new', createCategory);
router.put('/:id', updateCategory);
router.delete('/delete/:id', deleteCategory);
router.put('/:id/status', setCategoryStatus);

module.exports = router;

function getAllList(req, res, next) {
    Category.getAllList((err, categories) => {
        if (err) {
            next(err);
        }
        res.json(categories);
    })
}

function getAllWithStats(req, res, next) {
    Category.getAllWithStats((err, categories) => {
        if (err) {
            next(err);
        }
        res.json(categories);
    })
}

function getById(req, res, next) {
    Category.getByID(req.params.id, (err, category) => {
        if (err) {
            next(errors.ID_NOT_FOUND(req.params.id));
        }
        res.json(category);
    })
}

function getItemThumbnails(req, res, next) {
    const count = parseInt(req.sanitize(req.query.count));
    Category.getItemThumbnails(req.params.id, count, (err, thumbnails) => {
        if (err) {
            next(errors.ID_NOT_FOUND(req.params.id))
        }
        res.json(thumbnails);
    })
}

function createCategory(req, res, next) {
    let newCategory = req.body;
    newCategory.name = req.sanitize(newCategory.name);
    newCategory.description = req.sanitize(newCategory.description);

    //validate input data
    if (utils.isNullOrEmpty(newCategory.name)) {
        next(errors.NULL_OR_EMPTY('name'));
    } else {
        //Check if category with current name already exists
        Category.checkOtherNameExists(0, newCategory.name, (err, results) => {
            if(results === 0) {
                Category.create(newCategory, (err, insertId) => {
                    if (err) {
                        next(err);
                    }
                    newCategory.id = insertId;
                    res.json(newCategory);
                })
            } else {
                res.status(409).send(errors.DUPLICATE_ENTRY("name", newCategory.name));
            }
        })
    }
}

function updateCategory(req, res, next) {
    let category = {
        id: req.params.id,
        name: req.sanitize(req.body.name),
        description: req.sanitize(req.body.description),
        status: req.sanitize(req.body.status),
        img: req.body.img
    };

    Category.checkOtherNameExists(category.id, category.name, (err, result) => {
        if (result > 0) {
            res.status(409).send(errors.DUPLICATE_ENTRY('name', category.name));
        } else {
            if(utils.isNullOrEmpty(category.name)) {
                res.status(400).send(errors.NULL_OR_EMPTY('name'));
            } else {
                Category.update(category, (err, updatedCategory) => {
                    if (err) {
                        next(err);
                    }
                    res.json(updatedCategory);
                });
            }
        }
    })
}

function setCategoryStatus(req, res, next) {
    const categoryId = req.params.id;
    const status = req.body.status;

    if (!_.includes([1,2,3], status)) {
        res.status(404);
        next("This status does not exist.");
    }

    Category.setCategoryStatus(categoryId, status, (err, updatedCategory) => {
        if (err) {
            res.status(500);
            next(err);
        }
        res.json(updatedCategory);
    })

}

function deleteCategory(req, res, next) {
    Category.delete(req.params.id, (err, deleted) => {
        if (err) {
            res.status(500);
            next(err);
        }
        res.json(deleted);
    });
}

function getByQuestionId(req, res, next) {
    Category.getByQuestionId(req.params.id, (err, categories) => {
        res.json(categories);
    });
}
