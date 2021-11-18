const { merge, isUndefined } = require("@dvori/utils");

module.exports = (newHeaders = {}) => ({
	onRequest: (config) => {
		if (isUndefined(config.headers)) {
			config.headers = {};
		}

		config.headers = merge(newHeaders, config.headers);
		return config;
	},
});
