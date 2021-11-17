const { merge, isUndefined } = require("@dvori/utils");

module.exports = (newAgentStr = "") => ({
	onRequest: (config) => {
		try {
			if (isUndefined(config.headers)) {
				config.headers = {};
			}

			let newAgent = { "User-Agent": newAgentStr };

			config.headers = merge(config.headers, newAgent);
			return config;
		} catch (e) {
			throw e;
		}
	},
});
