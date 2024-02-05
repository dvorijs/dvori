import { beforeEach, afterEach, describe, test, expect, vi } from "vitest";
import {
    fetchWrapper,
    resolveUrl,
    shouldBeUrlEncoded,
    encodeUrlForm,
    prepareRequest,
    parseResponseByContentType,
} from "../../../src/core/fetchWrapper";

// Create a mock fetch function
const mockFetch = vi.fn();

// Stub the global fetch with the mockFetch
vi.stubGlobal("fetch", mockFetch);

describe("shouldBeUrlEncoded", () => {
    test("should return true for plain objects", () => {
        const body = { key: "value" };
        expect(shouldBeUrlEncoded(body)).toBe(true);
    });

    test("should return false for FormData instances", () => {
        const body = new FormData();
        expect(shouldBeUrlEncoded(body)).toBe(false);
    });

    test("should return false for Blob instances", () => {
        const body = new Blob();
        expect(shouldBeUrlEncoded(body)).toBe(false);
    });

    test("should return false for ArrayBuffer instances", () => {
        const body = new ArrayBuffer(8);
        expect(shouldBeUrlEncoded(body)).toBe(false);
    });

    test("should return false for null", () => {
        const body = null;
        expect(shouldBeUrlEncoded(body)).toBe(false);
    });
});

describe("encodeUrlForm", () => {
    test("should correctly encode a plain object into a URL-encoded string", () => {
        const data = { name: "John Doe", age: 30, city: "New York" };
        expect(encodeUrlForm(data)).toBe(
            "name=John%20Doe&age=30&city=New%20York"
        );
    });
});

describe("prepareRequest", () => {
    test("should correctly prepare request headers and body", () => {
        // const headers = { "Content-Type": "application/json" };
        const body = { neato: "burrito" };
        const { headers: processedHeaders, body: processedBody } =
            prepareRequest({}, body);
        expect(processedHeaders.get("Content-Type")).toBe("application/json");
        expect(processedBody).toEqual(JSON.stringify(body));
    });

    test("should correctly set Content-Type for FormData", () => {
        const headers = {};
        const body = new FormData();
        const { headers: processedHeaders } = prepareRequest(headers, body);
        expect(processedHeaders.has("Content-Type")).toBe(false);
    });

    // test("should correctly set Content-Type for URL-encoded form", () => {
    //     const headers = {};
    //     const body = { key: "value" };
    //     const { headers: processedHeaders, body: processedBody } =
    //         prepareRequest(headers, body);
    //     expect(processedHeaders.get("Content-Type")).toBe(
    //         "application/x-www-form-urlencoded"
    //     );
    //     expect(processedBody).toBe("key=value");
    // });

    // test("should correctly set Content-Type for JSON", () => {
    //     const headers = {};
    //     const body = JSON.stringify({ key: "value" });
    //     const { headers: processedHeaders, body: processedBody } =
    //         prepareRequest(headers, body);
    //     expect(processedHeaders.get("Content-Type")).toEqual(
    //         "application/json"
    //     );
    //     expect(processedBody).toBe(body);
    // });
});

describe("parseResponseByContentType", () => {
    test("should correctly parse JSON response", async () => {
        const json = { key: "value" };
        const response = new Response(JSON.stringify(json), {
            headers: { "Content-Type": "application/json" },
        });
        expect(await parseResponseByContentType(response)).toEqual(json);
    });

    test("should correctly parse text response", async () => {
        const text = "Hello, world!";
        const response = new Response(text, {
            headers: { "Content-Type": "text/plain" },
        });
        expect(await parseResponseByContentType(response)).toBe(text);
    });

    test("should correctly parse ArrayBuffer response", async () => {
        const buffer = new ArrayBuffer(8);
        const response = new Response(buffer, {
            headers: { "Content-Type": "application/octet-stream" },
        });
        expect(await parseResponseByContentType(response)).toEqual(buffer);
    });

    test("should correctly parse Blob response", async () => {
        const blob = new Blob(["Hello, world!"], { type: "text/plain" });
        const response = new Response(blob, {
            headers: { "Content-Type": "text/plain" },
        });
        const result = await parseResponseByContentType(response);
        expect(await result).toBe("Hello, world!");
    });

    // test("should return response as-is if content type is not set", async () => {
    //     const response = new Response("Hello, world!");
    //     expect(await parseResponseByContentType(response)).toBe(response);
    // });
});

describe("resolveUrl", () => {
    test("should return the url as is if no baseURL is provided", () => {
        const url = "https://example.com/path";
        expect(resolveUrl(undefined, url)).toBe(url);
    });

    test("should combine baseURL and a relative path correctly", () => {
        const baseURL = "https://example.com";
        const path = "/path";
        expect(resolveUrl(baseURL, path)).toBe("https://example.com/path");
    });

    test("should handle baseURL with trailing slash and path correctly", () => {
        const baseURL = "https://example.com/";
        const path = "path";
        expect(resolveUrl(baseURL, path)).toBe("https://example.com/path");
    });

    test("should ignore baseURL if url is absolute", () => {
        const baseURL = "https://example.com";
        const absoluteUrl = "https://another.com/path";
        expect(resolveUrl(baseURL, absoluteUrl)).toBe(absoluteUrl);
    });

    // Add more tests as needed to cover edge cases
});

describe("fetchWrapper", () => {
    // afterEach(() => {
    //     vi.clearAllMocks();
    // });
    beforeEach(() => {
        mockFetch.mockReset();
    });
    test("should call fetch with the resolved URL and options", async () => {
        // Setup the mock fetch to resolve with a specific response
        mockFetch.mockResolvedValue(
            new Response(JSON.stringify({ data: "ok" }), { status: 200 })
        );

        const config = { url: "https://example.com/api", method: "GET" };
        await fetchWrapper(config);

        expect(mockFetch).toHaveBeenCalledWith(
            config.url,
            expect.objectContaining({ method: "GET" })
        );
    });

    test("should throw an error for non-2xx responses", async () => {
        // Setup the mock fetch to resolve with a non-2xx response
        mockFetch.mockResolvedValue(
            new Response(JSON.stringify({ error: "Not Found" }), {
                status: 404,
            })
        );

        const config = { url: "https://example.com/notfound", method: "GET" };

        // Expect the fetchWrapper call to reject with an error
        await expect(fetchWrapper(config)).rejects.toThrow(
            "HTTP error! status: 404"
        );
    });

    // Add more tests to simulate network errors, different response types, etc.
});
