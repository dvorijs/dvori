const merge = require("deepmerge");
const zlib = require("zlib");

const { isPromise, pipe } = require("../utils");
// Middleware
// const json = require("./json");

/**
 * TODO
 *	+ uncompress the response body if needed
 * 	+ add config data
 *	- parse the body based on the headers (if possible)
 *	- validate the status code
 *	- handle redirects
 *	- retry failed requests
 *	-
 **/

let defaults = {
	headers: {},
	req: {
		config: {}
	},
	data: {}
};

const mergeResponseWithDefaults = defaults => res => {
	return merge(defaults, res);
};

module.exports = {
	defaults,
	async create({ res, plugins }) {
		let parseResponse = pipe(
			// external
			plugins
			// mergeResponseWithDefaults(defaults)
		);
		return parseResponse(res);
	}
};
