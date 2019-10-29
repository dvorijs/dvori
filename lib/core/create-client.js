const debug = require("debug")("dvori:createClient");

const { verbs, isFunction, pipe } = require("./utils");
const request = require("./request");
const response = require("./response");
const transport = require("./transports")();

const passthrough = fn => fn;

module.exports = ({
	defaultConfig = {},
	plugins = {
		onRequest: passthrough,
		onResponse: passthrough,
		onError: passthrough
	},
	middleware
} = {}) => {
	const makeReq = verb => async (...input) => {
		try {
			let config = await request.create({
				method: verb.toUpperCase(),
				input: input,
				plugins: await plugins.onRequest
			});
			let res = await transport.send({ config });
			return await response.create({ res: res, plugins: plugins.onResponse });
		} catch (e) {
			// throw await pipe(plugins.onError)(e);
			throw e;
		}
	};

	return verbs.reduce((acc, verb) => {
		acc[verb] = async (...input) => {
			let send = makeReq(verb);
			if (isFunction(middleware)) {
				send = await pipe(middleware)(makeReq(verb));
			}

			return send(...input);
		};
		return acc;
	}, {});
};
