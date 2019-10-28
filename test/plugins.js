const debug = require("debug")("rad:test:plugins");

const { isObject, pipeSync } = require("../lib/core/utils");

const { createClient, composePlugins } = require("../index");

const baseURL = require("../lib/plugins/base-url");
const json = require("../lib/plugins/json");

describe("Plugins Core", () => {
	test("Can require", () => {
		expect(composePlugins).toEqual(expect.any(Function));
	});
	test("composePlugins", async () => {
		let plugins = composePlugins(baseURL("https://httpbin.org"), json());
		expect(plugins).toEqual(expect.any(Object));
		expect(plugins).toHaveProperty("onRequest", expect.any(Function));
		expect(plugins).toHaveProperty("onResponse", expect.any(Function));
		expect(plugins).toHaveProperty("onError", expect.any(Function));
	});

	test("Make a request with plugins", async () => {
		const client = createClient({
			plugins: composePlugins(baseURL("https://httpbin.org"), json())
		});
		expect(client).toEqual(expect.any(Object));
		expect(client).toHaveProperty("get", expect.any(Function));

		let { data, status } = await client.get({ url: "/get" });
		debug(`status: ${status}`);
		expect(status).toEqual(200);
		expect(isObject(data)).toEqual(true);
	});
});

describe("Included Plugins", () => {
	describe("onRequest Plugins", () => {
		test("baseURL()", () => {
			let plugin = baseURL("https://httpbin.org");
			expect(plugin).toEqual(expect.any(Object));
			let configWithURL = pipeSync(plugin.onRequest)({ url: "/get" });
			expect(configWithURL).toEqual({ baseURL: "https://httpbin.org", url: "/get" });
		});

		test("headers()", () => {});
		test("data()", () => {});
		test("params()", () => {});
		test("userAgent()", () => {});
	});

	describe("onResponse Plugins", () => {
		test("json()", () => {});
		test("parse()", () => {});
	});
});

describe("Compose Multiple Plugins", () => {
	test("Using composePlugins multiple times", () => {
		let reqPlugin = composePlugins(baseURL("https://httpbin.org"));
		let resPlugin = composePlugins(json());
		let plugins = composePlugins(reqPlugin, resPlugin);
		expect(plugins).toEqual(expect.any(Object));
		expect(plugins).toHaveProperty("onRequest", expect.any(Function));
		expect(plugins).toHaveProperty("onResponse", expect.any(Function));
		expect(plugins).toHaveProperty("onError", expect.any(Function));

		let config = plugins.onRequest({ url: "/get" });
		expect(config.baseURL).toEqual("https://httpbin.org");

		let res = plugins.onResponse({ data: JSON.stringify({ nate: true }) });
		expect(res.data).toHaveProperty("nate", true);
	});
});
