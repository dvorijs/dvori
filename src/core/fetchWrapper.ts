// src/core/fetchWrapper.ts

import {
    RequestConfig,
    ResponseReturnType,
    StreamedResponse,
} from "../types/index";
// import { parseResponseByContentType, handleStream } from "../utils/contentTypeHandlers";
import { FetchError } from "../utils/errors";

/**
 * Determines whether the provided body should be URL-encoded.
 * This implementation checks if the body is a plain object, which is a common
 * use case for URL-encoded forms. More complex criteria can be added as needed,
 * such as checking for specific flags in the request configuration.
 *
 * @param body - The request body to be evaluated.
 * @returns {boolean} - True if the body should be URL-encoded; otherwise, false.
 */
export function shouldBeUrlEncoded(body: any): boolean {
    // Check if body is a plain object. This can be expanded to include other checks as necessary.
    return (
        body !== null &&
        typeof body === "object" &&
        !(body instanceof FormData) &&
        !(body instanceof Blob) &&
        !(body instanceof ArrayBuffer)
    );
}

/**
 * Encodes a JavaScript object into a URL-encoded string format.
 *
 * This function takes an object where the keys represent form field names
 * and the values represent the form field values. It encodes each key and value
 * pair into the `application/x-www-form-urlencoded` format, suitable for HTTP
 * request bodies typically sent in POST requests with form data.
 *
 * The encoding process involves converting the object into a string where each
 * key-value pair is separated by an ampersand (&) and each key is separated
 * from its value by an equals sign (=). Both keys and values are URL-encoded
 * using `encodeURIComponent` to ensure special characters are properly escaped.
 *
 * @param {Record<string, any>} data - The object containing the data to be URL-form-encoded.
 *                                      Keys represent the form field names, and values represent
 *                                      the form field values.
 * @returns {string} A URL-encoded string representing the input object, suitable
 *                   for use as a POST body in `application/x-www-form-urlencoded` format.
 *
 * Example usage:
 *
 * const formData = {
 *   name: "John Doe",
 *   age: 30,
 *   city: "New York"
 * };
 *
 * const encodedData = encodeUrlForm(formData);
 * // "name=John%20Doe&age=30&city=New%20York"
 */
export function encodeUrlForm(data: Record<string, any>): string {
    return Object.keys(data)
        .map(
            (key) =>
                encodeURIComponent(key) + "=" + encodeURIComponent(data[key])
        )
        .join("&");
}

/**
 * Prepares request headers and body, ensuring proper serialization and header setting.
 * This function is updated to handle all forms of HeadersInit, including arrays of key-value pairs.
 *
 * @param headers - Initial headers for the request in any valid HeadersInit format or undefined.
 * @param body - The body of the request, which may be an object that needs serialization.
 * @returns An object containing processed headers and potentially serialized body.
 */
export function prepareRequest(
    headers: HeadersInit | undefined,
    body: any
): { headers: Headers; body: any } {
    const processedHeaders =
        headers instanceof Headers ? headers : new Headers(headers);

    // Automatically set the Content-Type header based on the type of body
    console.log("prepareRequest() called");
    console.log("body: ", body);
    console.log("typeof body: ", typeof body === "object");
    console.log(
        "processedHeaders.has('Content-Type'): ",
        processedHeaders.has("Content-Type")
    );
    if (
        body &&
        typeof body === "object" &&
        !processedHeaders.has("Content-Type")
    ) {
        if (body instanceof FormData) {
            // FormData is automatically handled; no need to explicitly set Content-Type
            // }
            // else if (config.forceUrlEncoded) {
            //     // This is a hypothetical flag in your RequestConfig
            //     processedHeaders.set(
            //         "Content-Type",
            //         "application/x-www-form-urlencoded"
            //     );
            //     body = encodeUrlForm(body); // Encode the body as URL-form-encoded string
        } else {
            // Default to JSON for other object types, assuming it's not FormData, Blob, ArrayBuffer, etc.
            processedHeaders.set("Content-Type", "application/json");
            body = JSON.stringify(body); // Serialize the body as JSON
        }
    }

    return { headers: processedHeaders, body };
}

/**
 * Parses the response based on the content type header.
 * This function automatically detects the content type of the response and
 * parses it accordingly, supporting JSON, text, ArrayBuffer, and Blob formats.
 * It's designed to simplify response handling by abstracting away the manual
 * parsing typically required when dealing with different content types.
 *
 * @param {Response} response - The fetch API response object.
 * @returns {Promise<any>} - A promise that resolves to the parsed response content. The type of the returned content depends on the response's content type.
 */
export const parseResponseByContentType = async <T>(
    response: Response
): Promise<any> => {
    const contentType = response.headers.get("Content-Type");
    if (!contentType) {
        return response; // Return the response as-is if the content type is not set.
    }

    const parseJson = async <T>(response: Response): Promise<T> => {
        return response.json();
    };
    const parseText = (response: Response) => response.text();
    const parseArrayBuffer = (response: Response) => response.arrayBuffer();
    const parseBlob = (response: Response) => response.blob();

    if (contentType?.includes("application/json")) {
        return parseJson<T>(response);
    } else if (contentType?.includes("text/")) {
        return parseText(response);
    } else if (contentType?.includes("application/octet-stream")) {
        return parseArrayBuffer(response);
    } else if (
        contentType?.includes("image/") ||
        contentType.includes("video/") ||
        contentType.includes("application/pdf")
    ) {
        return parseBlob(response);
    }
    // Default to returning the response as-is if the content type is not explicitly handled.
    return response;
};

/**
 * Handles streaming of the response body.
 * This utility function is designed for scenarios where the response data is streamed,
 * allowing for efficient processing of large datasets or real-time data feeds.
 * It creates a ReadableStream that can be consumed by the client, providing an
 * interface to process data chunks as they arrive.
 *
 * @param {Response} response - The fetch API response object, expected to have a streamable body.
 * @returns {Promise<ReadableStream<Uint8Array> | null>} - A promise that resolves to a ReadableStream if the response body is present and streamable, or null otherwise.
 */
export const handleStream = async (
    response: Response
): Promise<ReadableStream<Uint8Array> | null> => {
    if (response.body) {
        return new ReadableStream({
            async start(controller) {
                const reader = response.body!.getReader();
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break; // Exit the loop when no more data is available.
                    controller.enqueue(value); // Pass each data chunk to the stream's consumer.
                }
                controller.close(); // Close the stream after all data has been read.
                reader.releaseLock(); // Release the lock on the stream.
            },
        });
    }
    return null; // Return null if the response body is not streamable.
};

/**
 * Resolves a given URL against the baseURL if provided.
 * This function constructs a new URL using the baseURL and the provided URL path,
 * supporting both relative and absolute paths. It gracefully handles errors,
 * returning the original URL if the resolution fails.
 *
 * @param {string | undefined} baseURL - The base URL set in the client's configuration.
 * @param {string} url - The URL or path for the request.
 * @returns {string} - The resolved URL.
 */
export function resolveUrl(baseURL: string | undefined, url: string): string {
    if (!baseURL) return url; // Return URL as is if no baseURL is provided.

    try {
        return new URL(url, baseURL).toString(); // Attempt to resolve URL against the baseURL.
    } catch (error) {
        console.error("Error resolving URL:", error);
        return url; // Fallback to the original URL in case of resolution error.
    }
}

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
    const { baseURL, url, headers, body, ...fetchOptions } = config;
    const resolvedUrl = resolveUrl(baseURL, url); // Resolve the full URL based on baseURL and provided path.

    // Prepare headers and potentially serialize body
    const { headers: processedHeaders, body: processedBody } = prepareRequest(
        headers,
        body
    );

    try {
        const response = await fetch(resolvedUrl, {
            ...fetchOptions,
            headers: processedHeaders,
            body: processedBody,
        });
        // const response = await fetch(resolvedUrl, fetchOptions);

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
            return parseResponseByContentType(response);
        }

        // Handle streaming responses if requested and supported by the response body.
        if (config.stream && response.body) {
            return handleStream(response);
        }

        // Return the full response object for non-streaming requests or when automatic parsing is disabled.
        return response;
    } catch (error) {
        console.error("Fetch error:", error);
        throw error; // Re-throw the error for further handling, ensuring it includes enhanced context.
    }
}

export default fetchWrapper;
