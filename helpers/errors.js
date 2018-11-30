const prefix = "Error: "
const errors = {
	NULL_OR_EMPTY: attr => {
		return prefix+"Attribute '"+attr+"' must not be null or empty."
	},
	UNEXPECTED: prefix+'There was an unexpected error during request handling.',
	UNEXPECTED_DATABASE: prefix+'There was an unexpected database error during request handling.',
	ID_NOT_FOUND: id => {
		return prefix+"Element with given ID does not exist: \""+id+"\"."
	},
	WRONG_CREDENTIALS: prefix+'The username or password is not correct. Try again.',
	MISSING_CREDENTIALS: prefix+'The username or password is missing. Try again.',
	DUPLICATE_ENTRY: (attr, value) => {
		return prefix+"Item '"+attr+"' with value '"+value+"' already exists.";
	}
}

module.exports = errors;