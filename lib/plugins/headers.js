const merge = require("deepmerge");
const { isUndefined } = require("../core/utils");

module.exports = (newHeaders = {}) => ({
	onRequest: config => {
		if (isUndefined(config.headers)) {
			config.headers = {};
		}

		config.headers = merge(newHeaders, config.headers);
		return config;
	}
});
