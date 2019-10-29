"use strict";
const debug = require("debug")("lambda:dvori:middleware:rate-limit");
const assert = require("assert");

// const { RateLimitError } = require("../../core/errors");

const microtimeNow = function() {
	const time = Date.now() * 1e3;
	const start = process.hrtime();
	const diff = process.hrtime(start);
	return time + diff[0] * 1e6 + Math.round(diff[1] * 1e-3);
};

// const toNumber = str => parseInt(str, 10);

/**
 * Check whether the first item of multi replies is null,
 * works with ioredis and node_redis
 *
 * @param {Array} replies
 * @return {Boolean}
 * @api private
 */

// function isFirstReplyNull(replies) {
// 	if (!replies) {
// 		return true;
// 	}

// 	return Array.isArray(replies[0])
// 		? // ioredis
// 		  !replies[0][1]
// 		: // node_redis
// 		  !replies[0];
// }

/**
 * Initialize a new limiter with `opts`:
 *
 *  - `id` identifier being limited
 *  - `db` redis connection instance
 *
 * @param {Object} opts
 * @api public
 */

class Limiter {
	constructor(opts) {
		this.id = opts.id;
		this.db = opts.db;
		this.tidy = opts.tidy || false;
		assert(this.id, ".id required");
		assert(this.db, ".db required");
		this.max = opts.max || 2500;
		this.duration = opts.duration || 3600000;
		this.key = "limit:" + this.id;
	}

	/**
	 * Inspect implementation.
	 *
	 * @api public
	 */

	inspect() {
		return "<Limiter id=" + this.id + ", duration=" + this.duration + ", max=" + this.max + ">";
	}

	/**
	 * Get values and header / status code and invoke `fn(err, info)`.
	 *
	 * redis is populated with the following keys
	 * that expire after N milliseconds:
	 *
	 *  - limit:<id>
	 *
	 * @param {Function} fn
	 * @api public
	 */

	get(fn) {
		let db = this.db;
		let tidy = this.key;
		let duration = this.duration;
		let key = this.key;
		let max = this.max;
		let now = microtimeNow();
		let start = now - duration * 1000;
		let operations = [
			["zremrangebyscore", key, 0, start],
			["zcard", key],
			["zadd", key, now, now],
			["zrange", key, 0, 0],
			["zrange", key, -max, -max],
			["pexpire", key, duration]
		];
		if (tidy) {
			operations.splice(5, 0, ["zremrangebyrank", key, 0, -(max + 1)]);
		}
		db.multi(operations).exec(function(err, res) {
			if (err) return fn(err);

			let isIoRedis = Array.isArray(res[0]);
			let count = parseInt(isIoRedis ? res[1][1] : res[1]);
			let oldest = parseInt(isIoRedis ? res[3][1] : res[3]);
			let oldestInRange = parseInt(isIoRedis ? res[4][1] : res[4]);
			let resetMicro = (Number.isNaN(oldestInRange) ? oldest : oldestInRange) + duration * 1000;
			let reset = Math.floor(resetMicro / 1000000);
			let delta = (reset * 1000 - Date.now()) | 0;
			let after = (reset - Date.now() / 1000) | 0;

			fn(null, {
				remaining: count < max ? max - count : 0,
				reset: reset,
				resetMs: Math.floor(resetMicro / 1000),
				delta: delta,
				after: after,
				total: max
			});
		});
	}
}

module.exports = ({ redis, id, requests, per }) => next => async config => {
	try {
		const rateLimiter = new Limiter({
			db: redis,
			id: "reddit",
			max: requests,
			duration: per
		});

		await new Promise((resolve, reject) => {
			// RateLimitError
			rateLimiter.get(function(err, limit) {
				if (err) {
					return reject(err);
				} else {
					// debug(limit);
					if (limit.remaining) {
						resolve();
					} else {
						// reject(new RateLimitError(`Rate limit exceeded, retry in ${limit.delta}`, limit));
						try {
							debug(`waiting: ${limit.delta}ms`);
							setTimeout(() => {
								debug("resolving after pause");
								resolve();
							}, limit.delta);
						} catch (e) {
							reject(e);
						}
					}
				}
			});
		});

		let response = await next(config);
		return response;
	} catch (e) {
		console.error(e);
		throw e;
	}
};
