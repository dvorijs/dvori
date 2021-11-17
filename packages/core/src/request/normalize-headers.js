module.exports = config => {
	let { headers } = config;
	config.headers = Object.entries(headers || {}).reduce((acc, entry, index) => {
		let [key, val] = entry;

		let exceptions = {
			"content-md5": "Content-MD5",
			dnt: "DNT",
			etag: "ETag",
			"last-event-id": "Last-Event-ID",
			tcn: "TCN",
			te: "TE",
			"www-authenticate": "WWW-Authenticate",
			"x-dnsprefetch-control": "X-DNSPrefetch-Control"
		};
		let normalizedHeaderKey;
		if (exceptions.hasOwnProperty(key.toLowerCase())) {
			normalizedHeaderKey = exceptions[key.toLowerCase()];
		} else {
			normalizedHeaderKey = key
				.split("-")
				.map(text => text.charAt(0).toUpperCase() + text.substr(1).toLowerCase())
				.join("-");
		}

		acc[normalizedHeaderKey] = val;
		return acc;
	}, {});
	return config;
};
