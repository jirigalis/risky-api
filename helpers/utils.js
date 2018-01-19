var utils = {
	isNullOrEmpty: val => {
		return val === null || val === "" || val === {};
	},

	isUndefined: val => {
		return typeof val === undefined;
	}

}

module.exports = utils;