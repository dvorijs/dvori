const { verbs, isUndefined, isObject, isPromise, isFunction, isAsyncFunc } = require("./utils");

const request = require("./request");
const response = require("./response");
const transport = require("./transports")();

const baseURL = require("./request/base-url");
const json = require("./response/json");

const pipe = (...funcs) => x => {
	if (funcs.length === 0) {
		return arg => arg;
	}

	if (funcs.length === 1) {
		return funcs[0];
	}
	return funcs.reduce((v, f) => f(v), x);
};
const pipeAsync = (...fns) => x =>
	fns.reduce(async (v, f) => {
		return isPromise(v) ? f(await v) : f(v);
	}, x);
const compose = (...funcs) => {
	if (funcs.length === 0) {
		return arg => arg;
	}

	if (funcs.length === 1) {
		return funcs[0];
	}

	return funcs.reduce((a, b) => (...args) => a(b(...args)));
};

async function main() {
	try {
		const createClient = (...middleware) => {
			const makeReq = verb => async (...input) => {
				try {
					console.log("ACTUAL REQUEST GETTING CALLED");
					let config = await request.create({
						method: verb.toUpperCase(),
						input: input,
						middleware: pipeAsync(baseURL("https://httpbin.org"))
					});
					let res = await transport.send({ config });
					return await response.create({ res: res, middleware: pipeAsync(json()) });
				} catch (e) {
					throw e;
				}
			};

			return verbs.reduce((acc, verb) => {
				acc[verb] = async (...input) => {
					const send = await pipeAsync(...middleware)(makeReq(verb));
					let res = await send(...input);
					return res;
				};
				return acc;
			}, {});
		};

		const queueMiddleware = next => async config => {
			console.log("~~~~~~~~~ queueMiddleware() ~~~~~~~~~");
			console.log("queueMiddleware before");
			let res = await next(config);
			console.log("queueMiddleware after");
			console.log("~~~~~~~~~ END queueMiddleware() ~~~~~~~~~");
			return res;
		};

		// const paginaitonMiddleware = next => async config => {
		// 	console.log("---------------- paginaitonMiddleware() -------------------");
		// 	// let res = await next(config);
		// 	// res.data = JSON.parse(res.data);
		// 	let results = [],
		// 		res;
		// 	do {
		// 		console.log(`fetching page: ${config.params.page}`);
		// 		res = await next(config);
		// 		// res.data = JSON.parse(res.data);
		// 		results.push(`page ${res.data.args.page}`);
		// 		config.params.page++;
		// 	} while (config.params.page <= 5);

		// 	res.data.results = results;
		// 	console.log("-------------------------------------------------");
		// 	return res;
		// };

		const testMiddleware = next => async config => {
			console.log("");
			console.log("============ testMiddleware() =================");
			console.log("testMiddleware before");
			let res = await next(config);
			console.log("testMiddleware after");
			console.log("================================================");
			console.log("");

			return res;
		};

		let client = createClient(queueMiddleware, testMiddleware);

		let cfg = {
			method: "GET",
			url: "/anything",
			headers: {
				"User-Agent": `test`,
				"Content-Type": "application/json"
			},
			params: {
				page: 1
			},
			timeout: 5000,
			maxContentLength: 10 * 1024 * 1024 //10mb
		};
		let { status, data } = await client.get(cfg);
		console.log(`status: ${status}`);
		// console.log(`data: ${JSON.stringify(data, null, 2)}`);
	} catch (e) {
		console.log(e);
	}
}

main();
