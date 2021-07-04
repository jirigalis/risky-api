const utils = {
	isNullOrEmpty: val => {
		return val === null || val === "" || val === {} || typeof val === 'undefined';
	},

	isUndefined: val => {
		return typeof val === 'undefined';
	},

	arrayEquals: (a, b) => {
		return Array.isArray(a) &&
			Array.isArray(b) &&
			a.length === b.length &&
			a.every((val, index) => val === b[index]);
	},

	compareCategories: (cat1, cat2) => {
		if (!(Array.isArray(cat1) && Array.isArray(cat2))) {
			return false;
		}

		const cat1IDs = cat1.map(c => c.id);
		const cat2IDs = cat2.map(c => c.id);

		return utils.arrayEquals(cat1IDs, cat2IDs);
	}
}

module.exports = utils;