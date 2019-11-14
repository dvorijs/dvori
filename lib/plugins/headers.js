const { merge, isUndefined } = require("../core/utils");

module.exports = (newHeaders = {}) => ({
	onRequest: config => {
		if (isUndefined(config.headers)) {
			config.headers = {};
		}

		config.headers = merge(newHeaders, config.headers);
		return config;
	}
});
