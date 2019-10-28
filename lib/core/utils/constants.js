/**
 * ==========================
 * Constants
 * ==========================
 */
// https://assertible.com/blog/7-http-methods-every-web-developer-should-know-and-how-to-test-them#head
const verbs = ["get", "post", "put", "patch", "delete", "options", "head", "trace"];

const errorCode = [
	"ETIMEDOUT",
	"ECONNRESET",
	"EADDRINUSE",
	"ECONNREFUSED",
	"EPIPE",
	"ENOTFOUND",
	"ENETUNREACH",
	"EAI_AGAIN"
];

const statusCodes = {
	redirects: [300, 301, 302, 303, 304, 305, 307, 308],
	errors: [408, 413, 429, 500, 502, 503, 504]
};

const httpOptionsWhitelist = [
	// https://nodejs.org/dist/latest-v9.x/docs/api/http.html#http_http_request_options_callback
	"protocol",
	"hostname",
	"family",
	"port",
	"localAddress",
	"socketPath",
	"method",
	"path",
	"headers",
	"auth",
	"agent",
	"createConnection",
	"timeout",
	// https://nodejs.org/dist/latest-v9.x/docs/api/https.html#https_https_request_options_callback
	"ca",
	"cert",
	"ciphers",
	"clientCertEngine",
	"key",
	"passphrase",
	"pfx",
	"rejectUnauthorized",
	"secureProtocol",
	"servernam"
];

const configOptionsWhitelist = [
	"id",
	"baseURL",
	"url",
	"params",
	"method",
	"headers",
	"timeout",
	"data",
	"files",
	"form",
	"maxContentLength"
];

module.exports = {
	verbs,
	errorCode,
	statusCodes,
	httpOptionsWhitelist,
	configOptionsWhitelist
};
