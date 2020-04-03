const { merge, isUndefined } = require("../core/utils");

module.exports = (newData = {}) => ({
	onRequest: config => {
		if (isUndefined(config.data)) {
			config.data = {};
		}

		config.data = merge(newData, config.data);
		return config;
	}
});
