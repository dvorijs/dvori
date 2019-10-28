const merge = require("deepmerge");
const { isUndefined } = require("../core/utils");

module.exports = (newParams = {}) => ({
	onRequest: config => {
		if (isUndefined(config.params)) {
			config.params = {};
		}

		config.params = merge(newParams, config.params);
		return config;
	}
});
