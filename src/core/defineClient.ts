import {
    ClientConfig,
    RequestConfig,
    LifecycleGroups,
    ComposableKey,
    LifecycleKey,
    VerbMethodOptions,
} from "../types/index";
import fetchWrapper from "./fetchWrapper";

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
            const result = await fn(context);
            if (result !== null && result !== undefined) {
                context = result; // Reassign context if the composable returns a new object
            }
        }
        return context; // Return the potentially modified context
    }

    // A wrapper around fetchWrapper that includes lifecycle hook execution
    async function customFetch(
        requestOptions: RequestConfig
    ): Promise<Response | ReadableStream> {
        // TODO: Only pass the request options to the beforeRequest hook

        try {
            // Execute beforeRequest hooks
            let updatedRequestOptions = await executeLifecycleStep(
                "beforeRequest",
                requestOptions
            );

            const fullRequestOptions = {
                ...config,
                ...updatedRequestOptions,
                url: requestOptions.url,
            };

            // const response = await fetchWrapper(fullRequestOptions);

            const response = await fetchWrapper(fullRequestOptions);

            // Execute afterResponse hooks
            return await executeLifecycleStep("afterResponse", response);
        } catch (error) {
            // Execute onError hooks
            throw await executeLifecycleStep("onError", error);
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
