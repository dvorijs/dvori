import {
    RequestConfig,
    ResponseReturnType,
    StreamedResponse,
} from "../types/index";

import {
    // encodeUrlForm,
    // shouldBeUrlEncoded,
    prepareRequest,
    parseResponseByContentType,
    handleStream,
    resolveUrl,
} from "../utils/helpers";

import { FetchError } from "../utils/errors";

/**
 * The core fetch wrapper function abstracts away the complexity of using the fetch API,
 * offering automatic error handling, response parsing based on content type,
 * and optional streaming support. This function leverages modular utility functions
 * for content type handling and stream processing to provide a flexible and
 * developer-friendly interface for making HTTP requests.
 *
 * @param {RequestConfig} config - The client or request-specific configuration, including URL, method, headers, body, and other fetch options.
 * @returns {Promise<ResponseReturnType<T>>} - A promise that resolves to the parsed response, supporting various types based on the content type or streaming option.
 * @template T - A generic type parameter that allows for specifying the expected type of a JSON-parsed response.
 */
export async function fetchWrapper<T>(
    config: RequestConfig
): Promise<ResponseReturnType<T> | StreamedResponse> {
    const {
        baseURL,
        url,
        headers,
        params,
        body,
        method = "GET",
        timeout = 10000, // Default timeout of 10 seconds
        signal: userSignal,
        ...fetchOptions
    } = config;
    let resolvedUrl = resolveUrl(baseURL, url); // Resolve the full URL based on baseURL and provided path.

    if (
        method.toUpperCase() === "GET" &&
        params &&
        Object.keys(params).length
    ) {
        const queryString = new URLSearchParams(params as any).toString();
        resolvedUrl += (resolvedUrl.includes("?") ? "&" : "?") + queryString;
    }

    // Create an AbortController instance and set a timeout for the request
    const controller = userSignal ? undefined : new AbortController();
    const signal = userSignal ?? controller?.signal;
    let timeoutId: ReturnType<typeof setTimeout> | undefined = undefined;

    // Setup timeout using either the provided or the new AbortController
    if (timeout && controller) {
        timeoutId = setTimeout(() => controller.abort(), timeout);
    }

    // Prepare headers and potentially serialize body
    const { headers: processedHeaders, body: processedBody } = prepareRequest(
        method,
        headers,
        body
    );

    // Set default fetch options and override with any provided options
    fetchOptions.mode = fetchOptions.mode || "cors"; // Default to 'cors' if not specified
    fetchOptions.referrerPolicy =
        fetchOptions.referrerPolicy || "no-referrer-when-downgrade";

    try {
        const response = await fetch(resolvedUrl, {
            ...fetchOptions,
            headers: processedHeaders,
            body: processedBody,
            signal,
        });

        // Automatically throw an error on failed HTTP status codes (e.g., 404, 500),
        // enhancing the error object with the response for additional context.
        if (!response.ok) {
            throw new FetchError(
                `HTTP error! status: ${response.status}`,
                response
            );
        }

        // Conditionally parse the response based on the content type if autoParseResponse is not explicitly set to false.
        if (config.parseResponse !== false) {
            return await parseResponseByContentType(response);
        }

        // Handle streaming responses if requested and supported by the response body.
        if (config.stream && response.body) {
            return handleStream(response);
        }

        // Return the full response object for non-streaming requests or when automatic parsing is disabled.
        return response;
    } catch (error) {
        // TODO: Handle errors more elegantly
        if (error instanceof Error && error.name === "AbortError") {
            console.error("Fetch request was aborted: ", error);
        }
        // console.error("Fetch error:", error);
        throw error; // Re-throw the error for further handling, ensuring it includes enhanced context.
    } finally {
        if (timeoutId !== undefined) {
            clearTimeout(timeoutId);
        }
    }
}

export default fetchWrapper;
