const zlib = require("zlib");

const needsUncompress = res => {
	let encoding = res.headers["Content-Encoding"];
	if (encoding && ["gzip", "compress", "deflate"].indexOf(encoding) > -1) {
		if (res.status !== 204) {
			return true;
		}
	}
	return false;
};

const uncompress = responseBody => {
	return new Promise((resolve, reject) => {
		zlib.unzip(responseBody, (err, decoded) => {
			if (err) {
				return reject(err);
			}
			resolve(decoded);
		});
	});
};

module.exports = async res => {
	if (needsUncompress(res)) {
		res.data = await uncompress(res.data);
	}
	return res;
};
