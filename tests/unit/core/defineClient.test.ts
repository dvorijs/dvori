import { beforeEach, afterEach, describe, test, expect, vi } from "vitest";

import {
    defineClient,
    registerComposables,
    executeLifecycleHook,
    customFetch,
} from "../../../src/core/defineClient";

import { fetchWrapper } from "../../../src/core/fetchWrapper";
import { ClientConfig, LifecycleGroups } from "../../../src/types/index";
import exp from "constants";

describe("registerComposables", () => {
    test("registers composables correctly", () => {
        const lifecycleGroups: LifecycleGroups = {
            beforeRequest: [],
            afterResponse: [],
            onError: [],
            finalize: [],
        };
        const config: ClientConfig = {
            composables: [
                {
                    beforeRequest: (config) => ({ ...config, added: true }),
                },
            ],
        };

        registerComposables(config, lifecycleGroups);

        expect(lifecycleGroups.beforeRequest).toHaveLength(1);
        expect(lifecycleGroups.afterResponse).toHaveLength(0);
    });
});

describe("executeLifecycleHook", () => {
    test("executes beforeRequest hooks correctly", async () => {
        const mockFn = vi.fn((config) => config);
        const lifecycleGroups: LifecycleGroups = {
            beforeRequest: [mockFn],
            afterResponse: [],
            onError: [],
            finalize: [],
        };

        await executeLifecycleHook(
            "beforeRequest",
            { url: "test" },
            lifecycleGroups
        );

        expect(mockFn).toHaveBeenCalledOnce();
    });
});

// describe("customFetch", () => {
//     test("calls fetchWrapper with correct arguments", async () => {
//         const client: any = {};
//         const config = { baseURL: "https://example.com" };
//         const lifecycleGroups = {
//             beforeRequest: [],
//             afterResponse: [],
//             onError: [],
//             finalize: [],
//         };

//         const response = await customFetch(
//             { url: "/test", method: "GET" },
//             client,
//             config,
//             lifecycleGroups
//         );

//         // const mockedFetchWrapper = vi.mocked(fetchWrapper, true);
//         // expect(fetchWrapper).toHaveBeenCalledWith({
//         //     baseURL: "https://example.com",
//         //     url: "/test",
//         //     method: "GET",
//         // });
//         // expect(response).toBe("mocked response");
//     });
// });

describe("defineClient", () => {
    let config: ClientConfig;

    beforeEach(() => {
        // Setup your config object here
        config = {
            // Fill this with the necessary properties
        };
    });

    afterEach(() => {
        // Any cleanup after each test
    });

    test("should return a client when given a valid config", () => {
        const client = defineClient(config);
        expect(client).toBeDefined();

        expect(client).toHaveProperty("get");
        expect(client).toHaveProperty("post");
        expect(client).toHaveProperty("put");
        expect(client).toHaveProperty("patch");
        expect(client).toHaveProperty("delete");
    });

    // Add more tests as necessary
});
