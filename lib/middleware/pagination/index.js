const debug = require("debug")("dvori:middleware:pagination");
const { isUndefined } = require("../../core/utils");

module.exports = ({ shouldKeepFetching, getCursor, handleNextPage }) => (next) => async (config) => {
	try {
		debug(`config.pagination: ${config.pagination}`);
		if (isUndefined(config.pagination)) {
			throw new Error("The pagination middleware requires the config to contain `pagination:true|false`");
		}

		let pages = [];
		let errors = [];

		const fetchPage = async (cursor) => {
			try {
				if (cursor) {
					config = handleNextPage(cursor, config);
					if (isUndefined(config)) {
						throw new Error("`handleNextPage() must return a config object`");
					}
				}
				debug(`key: ${config.meta.key}`);
				let response = await next(config);
				if (!config.pagination) {
					return response;
				}

				pages = pages.concat(response.data);

				if (shouldKeepFetching(response)) {
					let newCursor = getCursor(response);
					// debug(`new cursor: ${newCursor}`);
					return fetchPage(newCursor);
				} else {
					return { data: pages, errors };
				}
			} catch (e) {
				errors.push(e);
			}
		};

		return await fetchPage();
	} catch (e) {
		throw e;
	}
};
