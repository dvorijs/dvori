const debug = require("debug")("dvori:test:utils");

const { pipe, pipeSync, merge, buildURL } = require("../lib/core/utils");

describe("Helper functions", () => {
	test("pipeAsync()", async () => {
		let squareNumber = number => {
			return number * number;
		};
		let incNumberPromise = number => {
			return new Promise(resolve => {
				setTimeout(() => {
					resolve(number + 1);
				}, 10);
			});
		};

		let incNumberAsync = async number => {
			let results = await new Promise(resolve => {
				setTimeout(() => {
					resolve(number + 1);
				}, 10);
			});

			return results;
		};
		let func = pipe(squareNumber, incNumberPromise, incNumberAsync);
		expect(func).toEqual(expect.any(Function));
		expect(await func(2)).toEqual(6);
	});
	test("pipeSync()", () => {
		let squareNumber = number => {
			return number * number;
		};
		let incNumber = number => {
			return number + 1;
		};
		let func = pipeSync(squareNumber, incNumber);
		expect(func).toEqual(expect.any(Function));
		expect(func(2)).toEqual(5);
	});

	test("merge()", () => {
		const one = {
			post: {
				title: "Hello World",
				meta: {
					type: "markdown",
					tags: ["hello", "world"]
				}
			}
		};

		const two = {
			post: {
				title: "Hello Peoria",
				meta: {
					type: "text",
					tags: ["hello", "peoria", "illinois"]
				}
			}
		};

		const three = {
			post: {
				title: "Hello Boston",
				meta: {
					type: "html",
					tags: ["hello", "boston"]
				}
			}
		};

		expect(merge(one, two).post.title).toEqual("Hello Peoria");
		expect(merge(two, one).post.title).toEqual("Hello World");
		expect(merge(one, two, three).post.title).toEqual("Hello Boston");
	});

	test("buildURL()", () => {
		let base = "https://github.com";
		let path = "/trending/javascript";
		let params = {
			since: "daily"
		};

		let expectedURL = "https://github.com/trending/javascript?since=daily";

		let fullURL = buildURL({ base, path, params });
		expect(fullURL).toEqual(expectedURL);

		let fullURLWithSlash = buildURL({ base: `${base}/`, path, params });
		expect(fullURLWithSlash).toEqual(expectedURL);

		expect(() => {
			buildURL({ path, params });
		}).toThrow();
	});
});
