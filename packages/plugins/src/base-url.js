module.exports = uri => {
	return {
		onRequest: config => {
			config.baseURL = uri;
			return config;
		}
	};
};

