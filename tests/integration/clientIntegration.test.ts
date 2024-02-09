import { defineClient, defineComposable } from "../../src/index";
import {
    describe,
    test,
    expect,
    beforeAll,
    afterEach,
    afterAll,
    vi,
} from "vitest";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

// Create a mock fetch function
const mockFetch = vi.fn();

// Stub the global fetch with the mockFetch
vi.stubGlobal("fetch", mockFetch);
global.fetch = vi.fn();

// Define a mock server with request handlers
const server = setupServer(
    http.get("http://localhost/test-get", ({ request }) => {
        return HttpResponse.json({ message: "ok" });
    }),
    // Intercept POST /test-endpoint requests
    http.post("http://localhost/test-post", ({ request }) => {
        // Simulate an API that requires an Authorization header
        const authHeader = request.headers.get("Authorization");
        // console.log(request.headers);
        if (authHeader === "Bearer valid-token") {
            // Respond with a mocked JSON response
            return HttpResponse.json({ message: "Authenticated" });
        } else {
            // Respond with a 401 Unauthorized status
            return new HttpResponse(undefined, {
                status: 401,
                statusText: "Unauthorized",
            });
        }
    })
);

// Start the server before all tests
beforeAll(() => server.listen());

// Reset any request handlers that are declared as a part of our tests
// (i.e., for testing one-time error scenarios)
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished
afterAll(() => server.close());

describe("integration test for client verbs", () => {
    test("integration test with get", async () => {
        const client = defineClient({
            baseURL: "http://localhost",
        });

        const data = await client.get("/test-get");

        expect((data as any).message).toBe("ok");
    });
    test("integration test with post", async () => {
        function createFetchResponse(data) {
            return { json: () => new Promise((resolve) => resolve(data)) };
        }
        mockFetch.mockResolvedValue(
            new Response(JSON.stringify({ message: "Authenticated" }), {
                status: 200,
            })
        );

        const client = defineClient({
            baseURL: "http://localhost",
        });

        // Add a body to the request
        const data = await client.post("/test-post", {
            body: { key: "value" },
        });

        expect((data as any).message).toBe("Authenticated");
    });

    test("integration test with authentication composable", async () => {
        mockFetch.mockResolvedValue(
            new Response(JSON.stringify({ data: "ok" }), { status: 200 })
        );

        const useAuth = defineComposable({
            beforeRequest: async (config) => {
                // Add the Authorization header to the request
                return {
                    ...config,
                    headers: {
                        ...config.headers,
                        Authorization: "Bearer valid-token",
                    },
                };
            },
        });

        const client = defineClient({
            baseURL: "http://localhost",
            composables: [useAuth],
        });

        // Testing authenticated request
        const data = await client.post("/test-post");

        // Verify the response
        expect((data as any).message).toBe("Authenticated");
    });
});
