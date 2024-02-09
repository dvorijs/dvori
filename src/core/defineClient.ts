import {
    ClientConfig,
    RequestConfig,
    PostRequestHookParams,
    LifecycleGroups,
    ComposableKey,
    LifecycleKey,
    VerbMethodOptions,
    ResponseReturnType,
    StreamedResponse,
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
    async function executeLifecycleHook(
        name: LifecycleKey,
        context: any,
        helpers?: PostRequestHookParams
    ) {
        for (const fn of lifecycleGroups[name]) {
            let result;
            if (
                name === "afterResponse" ||
                name === "onError" ||
                name === "finalize"
            ) {
                // Ensure postRequestParams is provided for post-request hooks
                if (!helpers) {
                    throw new Error(
                        "Post request hook parameters are required for afterResponse and onError lifecycle steps."
                    );
                }
                result = await fn(context, helpers);
            } else {
                result = await fn(context);
            }

            if (typeof result === "function") {
                console.log(" ===== DOES THIS EVER GET CALLED =====");
                // Propagate function up if returned
                return result;
            } else if (result !== null && result !== undefined) {
                context = result; // Reassign context if the composable returns a new object
            }
        }
        return context; // Return the potentially modified context
    }

    // HTTP method implementations
    const client = {
        get: async <T>(url: string, options: VerbMethodOptions = {}) => {
            return customFetch<T>({ ...options, url, method: "GET" }, client);
        },
        post: async <T>(url: string, options: VerbMethodOptions = {}) => {
            return customFetch<T>({ ...options, url, method: "POST" }, client);
        },
        put: async <T>(url: string, options: VerbMethodOptions = {}) => {
            return customFetch<T>({ ...options, url, method: "PUT" }, client);
        },
        delete: async <T>(url: string, options: VerbMethodOptions = {}) => {
            return customFetch<T>(
                { ...options, url, method: "DELETE" },
                client
            );
        },
        patch: async <T>(url: string, options: VerbMethodOptions = {}) => {
            return customFetch<T>({ ...options, url, method: "PATCH" }, client);
        },
        head: async <T>(url: string, options: VerbMethodOptions = {}) => {
            return customFetch<T>({ ...options, url, method: "HEAD" }, client);
        },
        options: async <T>(url: string, options: VerbMethodOptions = {}) => {
            return customFetch<T>(
                { ...options, url, method: "OPTIONS" },
                client
            );
        },
    };

    // A wrapper around fetchWrapper that includes lifecycle hook execution
    async function customFetch<T>(
        requestOptions: RequestConfig,
        client: any
    ): Promise<ResponseReturnType<T> | StreamedResponse> {
        // TODO: Only pass the request options to the beforeRequest hook
        let currentConfig;

        const retry = async () => {
            return customFetch<T>(requestOptions, client /*retryCount + 1*/);
        };

        const cancel = () => {
            const controller = new AbortController();
            return controller.abort();
        };

        const postRequestParams = {
            retry,
            cancel,
            client,
        };

        try {
            // Execute beforeRequest hooks
            currentConfig = await executeLifecycleHook(
                "beforeRequest",
                requestOptions
            );

            const fullRequestOptions = {
                ...config,
                ...currentConfig,
                url: requestOptions.url,
            };

            // const response = await fetchWrapper(fullRequestOptions);

            const response = await fetchWrapper<T>(fullRequestOptions);

            // Execute afterResponse hooks
            return await executeLifecycleHook("afterResponse", response, {
                ...postRequestParams,
                config: fullRequestOptions,
            });
        } catch (error) {
            // Execute onError hooks
            const processedError = await executeLifecycleHook(
                "onError",
                error,
                {
                    ...postRequestParams,
                    config: currentConfig,
                }
            );
            if (processedError instanceof Error) {
                throw processedError; // Rethrow a possibly transformed error
            } else {
                // Return a default or transformed response
                return processedError;
            }
        } finally {
            // Execute finalize hooks
            await executeLifecycleHook(
                "finalize",
                {},
                {
                    ...postRequestParams,
                    config: currentConfig,
                }
            );
        }
    }

    return client;
}
