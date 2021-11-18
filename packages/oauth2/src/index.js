const debug = require("debug")("dvori:package:oauth2");

const { isUndefined } = require("@dvori/utils");

const addToken = (type, accessToken, config) => {
	if (type === "bearer") {
		if (isUndefined(config.headers)) {
			config.headers = {};
		}
		config.headers = { ...config.headers, Authorization: `Bearer ${accessToken}` };
	} else if (type === "query") {
		if (isUndefined(config.params)) {
			config.params = {};
		}
		config.params = { ...config.params, access_token: accessToken };
	} else {
		throw new Error(`${type} is not a valid OAuth2 Token type`);
	}
	return config;
};

module.exports = ({ type, statusCodes, refreshTokenFn, getTokensFn, setTokensFn } = {}) => (next) => async (config) => {
	const { accessToken, refreshToken } = getTokensFn();

	config = addToken(type, accessToken, config);

	let response = await next(config);

	if (statusCodes.indexOf(response.status) > -1) {
		let newAccessToken = await refreshTokenFn({ refreshToken: refreshToken });
		await setTokensFn(config, newAccessToken);

		config = addToken(type, newAccessToken, config);

		return await next(config);
	}
	return response;
};
