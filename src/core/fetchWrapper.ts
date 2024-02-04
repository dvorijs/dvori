// src/core/fetchWrapper.ts

import { RequestConfig } from "../types/index";

/**
 * Resolves a given URL against the baseURL if provided.
 * @param baseURL The base URL set in the client's configuration.
 * @param url The URL or path for the request.
 * @returns The resolved URL.
 */
export function resolveUrl(baseURL: string | undefined, url: string): string {
    // If baseURL is not provided, return url as is.
    if (!baseURL) return url;

    // Construct a new URL using baseURL and the provided url.
    // This handles cases where url is relative or absolute.
    try {
        return new URL(url, baseURL).toString();
    } catch (error) {
        console.error("Error resolving URL:", error);
        return url; // Fallback to the original url in case of error.
    }
}

/**
 * The core fetch wrapper function that abstracts away the complexity of using the fetch API.
 * @param config The client or request-specific configuration.
 * @param url The URL for the request, which can be a full URL or a path to be resolved against baseURL.
 * @returns A promise that resolves to the response.
 */
export async function fetchWrapper(
    config: RequestConfig
): Promise<Response | ReadableStream | string> {
    const { baseURL, url, ...fetchOptions } = config;
    const resolvedUrl = resolveUrl(baseURL, url);

    try {
        //
        // if (
        //     config.body &&
        //     typeof config.body === "object" &&
        //     headers.get("Content-Type") === "application/json"
        // ) {
        //     config.body = JSON.stringify(config.body);
        // }

        const response = await fetch(resolvedUrl, fetchOptions);

        // Automatically throw an error on failed HTTP status codes (e.g., 404, 500).
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Check the response content type and return the appropriate data type.
        const contentType = response.headers.get("Content-Type");
        if (contentType?.includes("application/json")) {
            return response.json();
        } else if (contentType?.includes("text/")) {
            return response.text();
        }

        // Check if streaming is requested and supported
        if (config.stream && response.body) {
            // Handle streaming response
            const reader = response.body.getReader();
            return new ReadableStream({
                async start(controller) {
                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) {
                            break; // Exit the loop if the stream is finished
                        }
                        controller.enqueue(value); // Enqueue chunk into the stream
                    }
                    controller.close(); // Close the stream
                    reader.releaseLock();
                },
            });
        } else {
            // Return the full response for non-streaming requests
            return response;
        }
    } catch (error) {
        console.error("Fetch error:", error);
        throw error; // Re-throw the error for further handling.
    }
}

export default fetchWrapper;
