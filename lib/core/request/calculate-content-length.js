const { isStream } = require("../utils");

module.exports = config => {
	if (config.data && !isStream(config.data)) {
		let { data } = config;

		config.headers["Content-Length"] = data.length;
	}
	return config;
};
