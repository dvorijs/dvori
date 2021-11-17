const { createClient, composeMiddleware } = require("@dvori/core");

describe("Core", () => {
	test("Can require", () => {
		expect(createClient).toEqual(expect.any(Function));
		expect(composeMiddleware).toEqual(expect.any(Function));
	});

	test("Client Interface", () => {
		const client = createClient({});
		expect(client).toEqual(expect.any(Object));

		expect(client).toHaveProperty("get", expect.any(Function));
		expect(client).toHaveProperty("post", expect.any(Function));
		expect(client).toHaveProperty("put", expect.any(Function));
		expect(client).toHaveProperty("patch", expect.any(Function));
		expect(client).toHaveProperty("delete", expect.any(Function));
		expect(client).toHaveProperty("options", expect.any(Function));
		expect(client).toHaveProperty("head", expect.any(Function));
		expect(client).toHaveProperty("trace", expect.any(Function));
	});

	test("Create Client Methods", async () => {
		const client = createClient({});
		let { status } = await client.get({
			url: "https://www.reddit.com/r/sausagetalk/new.json",
		});
		expect(status).toEqual(200);
	});
});
