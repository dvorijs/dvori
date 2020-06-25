const { isStream, isBuffer, isArrayBuffer, isObject, isArray, isString } = require("../utils");
const { RequestError } = require("../errors");

module.exports = (config) => {
	if (config.data && !isStream(config.data)) {
		let { data } = config;

		// convert JS obj / arrays to string
		if (isObject(data) || isArray(data)) {
			try {
				data = JSON.stringify(data);
			} catch (e) {}
		}

		if (isBuffer(data)) {
		} else if (isArrayBuffer(data)) {
			data = Buffer.from(new Uint8Array(data));
		} else if (isString(data)) {
			data = Buffer.from(data, "utf-8");
		} else {
			throw new RequestError("Data must be an Object, a String, an ArrayBuffer, a Buffer, or a Stream");
		}
		config.data = data;
	}

	return config;
};
