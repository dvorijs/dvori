const pkg = require("../../package.json");
const { merge } = require("@dvori/utils");
const debug = require("debug")("dvori:core:request");

const { isString, pipeSync } = require("@dvori/utils");
const { RequestError } = require("../errors");

const convertDataToBuffer = require("./data-to-buffer");
const calcContentLength = require("./calculate-content-length");
const normalizeHeaders = require("./normalize-headers");

const defaults = {
	url: "",
	method: "GET",
	headers: {
		"User-Agent": `${pkg.name}/${pkg.version}`,
		// "Content-Type": "application/x-www-form-urlencoded"
		"Content-Type": "application/json",
	},
	timeout: 5000,
	maxContentLength: 10 * 1024 * 1024, //10mb
};

/**
 * Helpers
 */
const convertArgsToConfig = (args) => {
	return args.reduce((acc, current) => {
		if (isString(current)) {
			acc.url = current;
			return acc;
		} else {
			return merge(acc, current);
		}
	}, {});
};

/**
 * Internal Middleware
 */

// Ignore any config params not in the whitelist at the top of this file
// const normalizeConfig = allowed => config => {
// 	return allowed.reduce((acc, key) => ({ ...acc, [key]: config[key] }), {});
// };

// TODO
const validateConfig = (config) => {
	if (!config.url || config.url.length === 0) {
		throw new RequestError("You must pass a valid URL");
	}
	return config;
};

const mergeConfigWithDefaults = (defaults) => (config) => {
	return merge(defaults, config);
};

module.exports = {
	defaults,
	async create({ method = "GET", input, plugins } = {}) {
		let rawConfig = convertArgsToConfig(input);
		rawConfig.method = method;
		const prepConfig = pipeSync(
			// external
			plugins,
			// internal
			mergeConfigWithDefaults(defaults),
			// normalizeConfig(configWhitelist),
			normalizeHeaders,
			convertDataToBuffer,
			calcContentLength,
			validateConfig
		);

		return prepConfig(rawConfig);
	},
};
