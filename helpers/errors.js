const prefix = "Error: "
const errors = {
	NULL_OR_EMPTY: attr => {
		return {
			code: 400,
			msg: prefix+ "Attribute '" + attr + "' must not be null or empty."
		}
	},
	UNEXPECTED: {
		code: 400,
		msg: prefix+ 'There was an unexpected error during request handling.',
	},
	UNEXPECTED_DATABASE: {
		code: 400,
		msg: prefix+ 'There was an unexpected database error during request handling.',
	},
	ID_NOT_FOUND: id => {
		return {
			code: 404,
			msg: prefix + "Element with given ID does not exist: \"" + id + "\"."
		}
	},
	WRONG_CREDENTIALS: {
		code: 401,
		msg: prefix+'The username or password is not correct. Try again.',
	},
	MISSING_CREDENTIALS: {
		code: 401,
		msg: prefix+'The username or password is missing. Try again.',
	},
	DUPLICATE_ENTRY: (attr, value) => {
		return {
			code: 409,
			msg: prefix+ "Item '" + attr + "' with value '" + value + "' already exists."
		};
	},
	INVALID_ARGUMENT: argName => {
		return {
			code: 400,
			msg: prefix + "Attribute with name: \"" + argName + "\" has a wrong value."
		}
	},
	CUSTOM_ERROR: msg => {
		return {
			code: 400,
			msg: prefix + msg
		}
	}

}

module.exports = errors;
