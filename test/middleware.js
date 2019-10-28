const debug = require("debug")("rad:test:middleware");

const { createClient, composeMiddleware } = require("../index");

describe("Middleware Core", () => {
	test("Can require", () => {
		expect(composeMiddleware).toEqual(expect.any(Function));
	});

	test("Compose Middleware", async () => {
		const customMiddleware = next => async config => {
			config.params = { nate: "rad" };
			let res = await next(config);
			res.data = JSON.stringify(JSON.parse(res.data));
			return res;
		};
		const client = createClient({ middleware: composeMiddleware(customMiddleware) });
		let response = await client.get({ url: "https://httpbin.org/get" });
		expect(response.status).toEqual(200);
		expect(response.req.config.params.nate).toEqual("rad");
		expect(response.data).toEqual(expect.any(String));
	});
});
