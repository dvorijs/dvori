class ConfigurationError extends Error {
	constructor(...params) {
		super(...params);
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, ConfigurationError);
		}
		this.name = "ConfigurationError";
	}
}
exports.ConfigurationError = ConfigurationError;

class RequestError extends Error {
	constructor(...params) {
		super(...params);
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, RequestError);
		}
		this.name = "RequestError";
	}
}
exports.RequestError = RequestError;

class ResponseError extends Error {
	constructor(...params) {
		super(...params);
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, ResponseError);
		}
		this.name = "ResponseError";
	}
}
exports.ResponseError = ResponseError;

class RateLimitError extends Error {
	constructor(...params) {
		super(...params);
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, RateLimitError);
		}
		this.name = "RateLimitError";
	}
}
exports.RateLimitError = RateLimitError;
