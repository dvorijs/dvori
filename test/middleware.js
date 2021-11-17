// const debug = require("debug")("dvori:test:middleware");

// const { createClient, composeMiddleware } = require("../index");

// describe("Middleware Core", () => {
// test("Can require", () => {
// 	expect(composeMiddleware).toEqual(expect.any(Function));
// });
// test("Compose Middleware", async () => {
// 	const customMiddleware = next => async config => {
// 		config.params = { nate: "dvori" };
// 		let res = await next(config);
// 		res.data = JSON.stringify(JSON.parse(res.data));
// 		return res;
// 	};
// 	const client = createClient({ middleware: composeMiddleware(customMiddleware) });
// 	let response = await client.get({ url: "https://httpbin.org/get" });
// 	expect(response.status).toEqual(200);
// 	expect(response.req.config.params.nate).toEqual("dvori");
// 	expect(response.data).toEqual(expect.any(String));
// });
// });
