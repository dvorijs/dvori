const http = require("http");
const https = require("https");
const url = require("url");

const { merge, httpOptionsWhitelist, buildURL, isStream, pipe } = require("@dvori/utils");
const { RequestError, ResponseError } = require("../errors");

const normalizeHeaders = require("../request/normalize-headers");
const uncompress = require("../response/uncompress-http-response");

/**
 * TODO
 *	- handle streams
 *	- canceled requests
 *	- handle other errors
 **/

const normalizeURL = (config) => {
	let uri = config.url;
	let baseURL = config.baseURL;
	let params = config.params;

	let fullURL = buildURL({ base: baseURL, path: uri, params: params });

	let { protocol, hostname, port, path } = url.parse(fullURL);
	delete config.url;
	delete config.baseURL;
	delete config.params;
	return merge(config, { protocol, hostname, port, path });
};

const normalizeOptions = (options) => {
	return httpOptionsWhitelist.reduce((acc, key) => ({ ...acc, [key]: options[key] }), {});
};

const configToHTTPOptions = (config) => {
	let options = merge({}, config);
	let handler = pipe(normalizeURL, normalizeOptions);

	return handler(options);
};

const handleReq = ({ options = {}, data = null }) => {
	return new Promise((resolve, reject) => {
		const req = (/https/.test(options.protocol) ? https : http).request(options, (res) => resolve(res));

		if (options.timeout) {
			req.setTimeout(options.timeout);
			req.on("timeout", () => {
				let err = new RequestError(`timeout of ${options.timeout} ms exceeded`);
				err.code = "ETIMEDOUT";
				req.emit("error", err);
				req.abort();
				reject(err);
			});
		}

		req.on("error", (err) => {
			// swallow
			if (req.aborted) return;
			reject(err);
		});

		if ((options.method === "POST" || options.method === "PUT") && data) {
			if (isStream(data)) {
				data.pipe(req);
			} else {
				req.write(data);
			}
		}

		req.end();
	});
};

const handleRes = ({ config, res }) => {
	return new Promise((resolve, reject) => {
		let body = [];
		res.on("data", (d) => {
			// make sure the content length is not over the maxContentLength if specified
			if (config.maxContentLength > -1 && Buffer.concat(body).length > config.maxContentLength) {
				res.destroy();
				reject(new ResponseError(`maxContentLength size of ${config.maxContentLength} exceeded`));
			} else {
				return body.push(d);
			}
		});

		res.on("end", async () => {
			let responseData = Buffer.concat(body);

			// TODO: setup a response middleware to auto parse responseData based
			//		 on it's content-type response header

			const createResponse = pipe(normalizeHeaders, uncompress);

			let { statusCode, statusMessage, headers } = res;
			const response = createResponse({
				req: { config },
				status: statusCode,
				statusMessage,
				headers,
				data: responseData.toString(),
			});

			resolve(response);
		});

		res.on("error", (e) => reject(new ResponseError(e)));
	});
};

module.exports = {
	send: async ({ config }) => {
		try {
			let options = await configToHTTPOptions(config);
			let res = await handleReq({ options, data: config.data });
			return await handleRes({ config, res });
		} catch (e) {
			throw e;
		}
	},
};
