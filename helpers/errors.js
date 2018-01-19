var errors = {
	NULL_OR_EMPTY: attr => {
		return "Attribute '"+attr+"' must not be null or empty."
	},
	UNEXPECTED: 'There was an unexpected error during request handling.',
	ID_NOT_FOUND: id => {
		return "Element with given ID does not exist: \""+id+"\"."
	}
}

module.exports = errors;