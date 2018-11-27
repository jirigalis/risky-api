var errors = {
	NULL_OR_EMPTY: attr => {
		return "Attribute '"+attr+"' must not be null or empty."
	},
	UNEXPECTED: 'There was an unexpected error during request handling.',
	ID_NOT_FOUND: id => {
		return "Element with given ID does not exist: \""+id+"\"."
	},
	WRONG_CREDENTIALS: 'The username or password is not correct. Try again.',
	MISSING_CREDENTIALS: 'The username or password is missing. Try again.',
	DUPLICATE_ENTRY: (attr, value) => {
		return "Item '"+atrr+"' with value '"+value+"' already exists.";
	},
	handleErrors: err => {
		
	}
}

module.exports = errors;