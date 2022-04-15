const utils = require('../helpers/utils');
const errors = require('../helpers/errors');

const express = require('express')
	, router = express.Router()
	, User = require('../models/User')
	, bcrypt = require('bcrypt')
	;

const { body, validationResult } = require('express-validator');

router.get('/', (req, res) => {
	User.getAllWithRoles(function(err, us)  {
		console.log("DEBUG: get all users");
		res.json(us);
	});
})

router.post('/new', [body('email').not().isEmpty().trim()], createUser);
router.put('/update/:id', [body('email').not().isEmpty().trim()], updateUser);
router.get('/:id', getById);
router.delete('/delete/:id', deleteUser);

function getById(req, res, next) {
    User.getById(req.params.id, (err, answer) => {
        if (err) {
            next(err);
        }
        res.json(answer);
    })
}

function createUser(req, res, next) {
	let newUser = req.body;
	newUser.email = req.sanitize(newUser.email);

	console.log(newUser);

	if (utils.isNullOrEmpty(newUser.email)) {
		next(errors.NULL_OR_EMPTY('e-mail'))
	} else if (utils.isNullOrEmpty(newUser.password)) {
		next(errors.NULL_OR_EMPTY('password'))
	} else {
		if (utils.isNullOrEmpty(newUser.role)) {
			newUser.role = 2;
		}
		User.checkUserExists(newUser.email, (err, userExists) => {
			if (userExists > 0) {
				res.status(409).send(errors.DUPLICATE_ENTRY('user', newUser.email))
			} else {
				bcrypt.genSalt(10, (err, salt) => {
					bcrypt.hash(newUser.password, salt, (err, hash) => {
						newUser.salt = salt;
						newUser.password = hash;
						User.create(newUser, (err, user) => {
							console.log('User successfully created', user);
							res.json(user)
						});	
					})					
				})
			}
		})
	}
}

function updateUser(req, res, next) {
	const userJson = req.body;
	const user = {
		id: req.params.id,
		firstname: req.sanitize(userJson.firstname),
		lastname: req.sanitize(userJson.lastname),
		email: req.sanitize(userJson.email),
		password: req.sanitize(userJson.password),
		role: req.sanitize(userJson.role),
	}

	console.log(user);

    if (utils.isNullOrEmpty(user.email)) {
        next(errors.NULL_OR_EMPTY('e-mail'));
    }

	User.checkOtherUserExists(user.id, user.email, (err, userExists) => {
		if (userExists > 0) {
			res.status(409).send(errors.DUPLICATE_ENTRY('user', user.email))
		} else {
			bcrypt.hash(user.password, 10, (err, hash) => {
				user.password = hash;
				User.update(user, (err, res2) => {
					if (err) {
						next(err);
					} else {
						res.json(res2);
					}
				})
			})			
		}
	})
}

function deleteUser(req, res, next) {
	User.delete(req.params.id, (err, res2) => {
		if (err) {
			next(err);
		}
		res.json(res2);
	})
}

module.exports = router;