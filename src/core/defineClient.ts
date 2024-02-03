import { ClientConfig, RequestConfig, Composable } from "../types/index";
import fetchWrapper from "./fetchWrapper";

type ComposableKey = keyof Composable;
type LifecycleKey = keyof LifecycleGroups;
type VerbMethodOptions = Omit<RequestConfig, "url">;

interface LifecycleGroups {
    beforeRequest: Function[];
    afterResponse: Function[];
    onError: Function[];
    finalize: Function[];
}

export function defineClient(config: ClientConfig) {
    // Initialize lifecycleGroups, including setup for completeness
    const lifecycleGroups: LifecycleGroups = {
        beforeRequest: [],
        afterResponse: [],
        onError: [],
        finalize: [],
    };

    // Organize and execute setup immediately if applicable
    config.composables?.forEach((composable) => {
        Object.keys(composable).forEach((key) => {
            if (typeof key === "string") {
                // Ensure the key is valid for LifecycleGroups
                const lifecycleKey: LifecycleKey | undefined =
                    (key as any) in lifecycleGroups
                        ? (key as LifecycleKey)
                        : undefined;

                if (lifecycleKey) {
                    const composableFunction = composable[key as ComposableKey];
                    if (typeof composableFunction === "function") {
                        // Now safely add the composable function to the correct lifecycle group
                        lifecycleGroups[lifecycleKey].push(composableFunction);
                    }
                }
            }
        });
    });

    // Function to execute composables for a given lifecycle step
    async function executeLifecycleStep(step: LifecycleKey, context: any) {
        for (const fn of lifecycleGroups[step]) {
            await fn(context); // 'context' will vary based on the lifecycle step
        }
    }

    // A wrapper around fetchWrapper that includes lifecycle hook execution
    async function customFetch(
        requestOptions: RequestConfig
    ): Promise<Response> {
        const fullRequestOptions = {
            ...config,
            ...requestOptions,
            url: requestOptions.url,
        };

        try {
            // Execute beforeRequest hooks
            await executeLifecycleStep("beforeRequest", fullRequestOptions);

            const response = await fetchWrapper(fullRequestOptions);

            // Execute afterResponse hooks
            await executeLifecycleStep("afterResponse", response);

            return response;
        } catch (error) {
            // Execute onError hooks
            await executeLifecycleStep("onError", error);
            throw error;
        } finally {
            // Execute finalize hooks
            await executeLifecycleStep("finalize", {});
        }
    }

    // HTTP method implementations
    return {
        async get(url: string, options: VerbMethodOptions = {}) {
            return customFetch({ ...options, url, method: "GET" });
        },
        async post(url: string, options: VerbMethodOptions = {}) {
            return customFetch({ ...options, url, method: "POST" });
        },
        async put(url: string, options: VerbMethodOptions = {}) {
            return customFetch({ ...options, url, method: "PUT" });
        },
        async delete(url: string, options: VerbMethodOptions = {}) {
            return customFetch({ ...options, url, method: "DELETE" });
        },
        async patch(url: string, options: VerbMethodOptions = {}) {
            return customFetch({ ...options, url, method: "PATCH" });
        },
        // Additional HTTP methods can be added here
    };
}
