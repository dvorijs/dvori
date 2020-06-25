const { isBuffer, isStream } = require("../utils");

module.exports = (config) => {
	if (config.data && !isStream(config.data)) {
		let { data } = config;

		if (isBuffer(data)) {
			config.headers["Content-Length"] = data.length;
		} else {
			config.headers["Content-Length"] = Buffer.byteLength(data);
		}
	} else {
		config.headers["Content-Length"] = 0;
	}
	return config;
};
