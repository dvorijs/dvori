import { defineClient, defineComposable } from "../../src/index";
import { test, expect, beforeAll, afterEach, afterAll } from "vitest";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

// Define a mock server with request handlers
const server = setupServer(
    // Intercept POST /test-endpoint requests
    http.post("http://localhost/test-endpoint", ({ request }) => {
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

test("integration test with authentication composable", async () => {
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
    const data = await client.post("/test-endpoint");

    // Verify the response
    expect((data as any).message).toBe("Authenticated");
});
