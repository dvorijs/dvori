import { beforeEach, afterEach, describe, test, expect, vi } from "vitest";
import { fetchWrapper, resolveUrl } from "../../../src/core/fetchWrapper";

// Create a mock fetch function
const mockFetch = vi.fn();

// Stub the global fetch with the mockFetch
vi.stubGlobal("fetch", mockFetch);

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
