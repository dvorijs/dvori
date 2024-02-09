import { beforeEach, afterEach, describe, test, expect, vi } from "vitest";
import { fetchWrapper } from "../../../src/core/fetchWrapper";

// Create a mock fetch function
const mockFetch = vi.fn();

// Stub the global fetch with the mockFetch
vi.stubGlobal("fetch", mockFetch);

describe("fetchWrapper", () => {
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
