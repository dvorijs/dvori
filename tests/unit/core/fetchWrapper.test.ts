import { beforeEach, afterEach, describe, test, expect, vi } from "vitest";
import {
    fetchWrapper,
    resolveUrl,
    shouldBeUrlEncoded,
    encodeUrlForm,
    prepareRequest,
    parseResponseByContentType,
} from "../../../src/core/fetchWrapper";

/*
Tests to add:
    - GET request with a body
    - GET request with URL parameters
    - POST request with form data and URL parameters
    - POST request with URL Parameters as the body
    - POST request with form data and a file

*/

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
            prepareRequest("POST", {}, body);
        expect(processedHeaders.get("Content-Type")).toBe("application/json");
        expect(processedBody).toEqual(JSON.stringify(body));
    });

    // TODO: Need to determine how to handle FormData and URL-encoded form
    // test("should correctly set Content-Type for FormData", () => {
    //     const headers = {};
    //     const body = new FormData();
    //     const { headers: processedHeaders } = prepareRequest(
    //         "POST",
    //         headers,
    //         body
    //     );
    //     expect(processedHeaders.has("Content-Type")).toBe(false);
    // });

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
        const url = "http://localhost/path";
        expect(resolveUrl(undefined, url)).toBe(url);
    });

    test("should combine baseURL and a relative path correctly", () => {
        const baseURL = "http://localhost";
        const path = "/path";
        expect(resolveUrl(baseURL, path)).toBe("http://localhost/path");
    });

    test("should handle baseURL with trailing slash and path correctly", () => {
        const baseURL = "http://localhost/";
        const path = "path";
        expect(resolveUrl(baseURL, path)).toBe("http://localhost/path");
    });

    test("should ignore baseURL if url is absolute", () => {
        const baseURL = "http://localhost";
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

    test("should call fetch with the resolved URL and options, including method and default headers", async () => {
        // Setup the mock fetch to resolve with a specific response
        mockFetch.mockResolvedValue(
            new Response(JSON.stringify({ data: "ok" }), { status: 200 })
        );

        const config = { url: "http://localhost/test-endpoint", method: "GET" };
        await fetchWrapper(config);

        // Check if fetch was called
        expect(mockFetch).toHaveBeenCalled();

        // Get the actual call arguments
        const [url, options] = mockFetch.mock.calls[0];

        // Assert the URL and method are as expected
        expect(url).toBe(config.url);
        // expect(options.method).toBe("GET");

        // Optionally, serialize headers and assert specific header values
        // const headers = Object.fromEntries(options.headers.entries());
        // Assert on specific headers if necessary, for example:
        // expect(headers).toHaveProperty('Content-Type', 'application/json');
    });

    test("should throw an error for non-2xx responses", async () => {
        // Setup the mock fetch to resolve with a non-2xx response
        mockFetch.mockResolvedValue(
            new Response(JSON.stringify({ error: "Not Found" }), {
                status: 404,
            })
        );

        const config = { url: "http://localhost/test-endpoint", method: "GET" };

        // Expect the fetchWrapper call to reject with an error
        await expect(fetchWrapper(config)).rejects.toThrow(
            "HTTP error! status: 404"
        );
    });

    test("GET request with a body", async () => {
        mockFetch.mockResolvedValue(
            new Response(JSON.stringify({ data: "ok" }), { status: 200 })
        );

        const body = { key: "value" };
        await fetchWrapper({
            method: "GET",
            url: "http://localhost",
            body: body as any,
        });
        // Expect fetch not to be called with a body for a GET request
        expect(mockFetch.mock.calls[0][1].body).toBeUndefined();
    });

    // test("GET request with a body", async () => {
    //     mockFetch.mockResolvedValueOnce(new Response(null, { status: 200 }));

    //     const config = {
    //         url: "http://localhost",
    //         method: "GET",
    //         body: { key: "value" },
    //     };
    //     await fetchWrapper(config);

    //     // Check that the fetch was called without a body
    //     expect(mockFetch).toHaveBeenCalledWith(
    //         config.url,
    //         expect.objectContaining({ method: "GET", body: undefined })
    //     );
    // });

    // test("GET request with URL parameters", async () => {
    //     mockFetch.mockResolvedValueOnce(
    //         new Response(JSON.stringify({ data: "ok" }), { status: 200 })
    //     );

    //     const config = { url: "http://localhost?query=123", method: "GET" };
    //     await fetchWrapper(config);

    //     expect(mockFetch).toHaveBeenCalledWith(
    //         "http://localhost?query=123",
    //         expect.objectContaining({ method: "GET" })
    //     );
    // });

    // test("POST request with form data and URL parameters", async () => {
    //     const formData = new FormData();
    //     formData.append("key", "value");

    //     mockFetch.mockResolvedValueOnce(
    //         new Response(JSON.stringify({ data: "ok" }), { status: 200 })
    //     );

    //     const config = {
    //         url: "http://localhost?query=123",
    //         method: "POST",
    //         body: formData,
    //     };
    //     await fetchWrapper(config);

    //     expect(mockFetch).toHaveBeenCalledWith(
    //         "http://localhost?query=123",
    //         expect.objectContaining({ method: "POST", body: formData })
    //     );
    // });

    // test("POST request where URL parameters serve as the body", async () => {
    //     mockFetch.mockResolvedValueOnce(
    //         new Response(JSON.stringify({ data: "ok" }), { status: 200 })
    //     );

    //     const config = {
    //         url: "http://localhost",
    //         method: "POST",
    //         body: { key: "value" },
    //     };
    //     await fetchWrapper(config);

    //     // Check that Content-Type is set to application/x-www-form-urlencoded
    //     expect(mockFetch).toHaveBeenCalledWith(
    //         config.url,
    //         expect.objectContaining({
    //             method: "POST",
    //             headers: expect.objectContaining({
    //                 "Content-Type": "application/x-www-form-urlencoded",
    //             }),
    //             body: encodeUrlForm({ key: "value" }), // Assuming your utility function is correctly encoding objects to URL-encoded strings
    //         })
    //     );
    // });

    // test("POST request with form data including files (multipart/form-data)", async () => {
    //     const formData = new FormData();
    //     formData.append(
    //         "file",
    //         new Blob(["file content"], { type: "text/plain" }),
    //         "test.txt"
    //     );

    //     mockFetch.mockResolvedValueOnce(
    //         new Response(JSON.stringify({ data: "ok" }), { status: 200 })
    //     );

    //     const config = {
    //         url: "http://localhost",
    //         method: "POST",
    //         body: formData,
    //     };
    //     await fetchWrapper(config);

    //     expect(mockFetch).toHaveBeenCalledWith(
    //         config.url,
    //         expect.objectContaining({ method: "POST", body: formData })
    //     );
    //     // Note: FormData and file handling is typically tested through integration tests or with mock FormData implementations.
    // });

    // test("Sending JSON as part of a URL query parameter", async () => {
    //     mockFetch.mockResolvedValueOnce(
    //         new Response(JSON.stringify({ data: "ok" }), { status: 200 })
    //     );

    //     const jsonParam = JSON.stringify({ key: "value" });
    //     const config = {
    //         url: `http://localhost?data=${encodeURIComponent(jsonParam)}`,
    //         method: "GET",
    //     };
    //     await fetchWrapper(config);

    //     expect(mockFetch).toHaveBeenCalledWith(
    //         `http://localhost?data=${encodeURIComponent(jsonParam)}`,
    //         expect.objectContaining({ method: "GET" })
    //     );
    // });

    // test("Handling non-2xx status codes without throwing immediately", async () => {
    //     mockFetch.mockResolvedValueOnce(
    //         new Response(JSON.stringify({ error: "Not Found" }), {
    //             status: 404,
    //         })
    //     );

    //     const config = {
    //         url: "http://localhost/notfound",
    //         method: "GET",
    //     };

    //     await expect(fetchWrapper(config)).rejects.toThrow(
    //         "HTTP error! status: 404"
    //     );
    // });

    // test("Sending a request with custom Content-Type without serialization", async () => {
    //     const rawBody = "raw data";
    //     mockFetch.mockResolvedValueOnce(
    //         new Response(JSON.stringify({ data: "ok" }), { status: 200 })
    //     );

    //     const config = {
    //         url: "http://localhost",
    //         method: "POST",
    //         headers: { "Content-Type": "text/plain" },
    //         body: rawBody,
    //     };
    //     await fetchWrapper(config);

    //     expect(mockFetch).toHaveBeenCalledWith(
    //         config.url,
    //         expect.objectContaining({
    //             method: "POST",
    //             headers: expect.objectContaining({
    //                 "Content-Type": "text/plain",
    //             }),
    //             body: rawBody,
    //         })
    //     );
    // });
});

describe.skip("Edge Cases", () => {
    test("GET request with a body", () => {});
    test("GET request with URL parameters", () => {});
    test("POST request with form data and URL parameters", () => {});
    test("POST request where URL parameters serve as the body:", () => {});
    // Ensure FormData is correctly handled, and files are properly included without setting
    // Content-Type manually, allowing the browser to set the boundary.
    test("POST request with form data including files (multipart/form-data)", () => {});
    test("Sending JSON as part of a URL query parameter:", () => {});
    test("Handling non-2xx status codes without throwing immediately", () => {});
    //Allow users to pass raw body content and a custom Content-Type, bypassing automatic serialization.
    test("Sending a request with custom Content-Type without serialization", () => {});
    test("Handling CORS errors gracefully", () => {});
    test("Requests with credentials (cookies):", () => {});
    test("Streaming responses in Node.js", () => {});
    test("Handling HTTP redirects", () => {});
    test("Parallel requests and request batching", () => {});
    test("Upload progress", () => {});
    test("Download progress", () => {});
});
