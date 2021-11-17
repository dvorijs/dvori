const debug = require("debug")("dvori:middleware:retry");

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

const shouldRetry = err => {
	const RETRIABLE_NETWORK_ERRORS = [
		"ECONNRESET",
		"ENOTFOUND",
		"ESOCKETTIMEDOUT",
		"ETIMEDOUT",
		"ECONNREFUSED",
		"EHOSTUNREACH",
		"EPIPE",
		"EAI_AGAIN"
	];
	return true;
};

module.exports = ({ retries = 1, backoffRate = 1.5 }) => next => async config => {
	try {
		let count = retries;
		const run = async () => {
			try {
				return await next(config);
			} catch (e) {
				if (shouldRetry(e) && --count) {
					debug("Retrying Error");
					await wait(((Math.pow(backoffRate, count) - 1) / 2) * 1000);
					await run();
				} else {
					throw e;
				}
			}
		};
		return await run();
	} catch (err) {
		throw err;
	}
};
