// I N T E R F A C E S
export interface ClientConfig extends RequestInit {
    baseURL?: string; // Specify a base URL for all requests made by the client.
    params?: Record<string, string | number>;
    stream?: boolean; // Specify whether to return a ReadableStream instead of a Response.
    parseResponse?: boolean; // Specify whether to automatically parse the response body based on the content type.
    composables?: Composable[]; // List of global composables applied to every request.
    timeout?: number; // For implementing request timeout
    signal?: AbortSignal; // New: Support for passing an existing AbortSignal

    onDownloadProgress?: (progressEvent: ProgressEvent) => void;
}

export interface RequestConfig
    extends Omit<ClientConfig, "composables | stream | parseResponse"> {
    url: string; // URL or a path that will be resolved against baseURL if provided.
}

export interface PostRequestHookParams {
    config: RequestConfig;
    retry: () => Promise<any> | void;
    cancel: () => Promise<void> | void;
    client: any;
}

export interface Composable {
    beforeRequest?: (
        config: RequestConfig
    ) => Promise<RequestConfig> | RequestConfig;
    afterResponse?: (
        response: Response,
        helpers?: PostRequestHookParams
    ) => Promise<Response> | Response;
    onError?: (
        error: any,
        helpers: PostRequestHookParams
    ) => Promise<any> | any;
    finalize?: (helpers?: PostRequestHookParams) => void;
}

// Used to group lifecycle hooks by their purpose
export interface LifecycleGroups {
    beforeRequest: Function[];
    afterResponse: Function[];
    onError: Function[];
    finalize: Function[];
}

// E N U M S
declare global {
    var Bun: any;
    var Deno: any;
}
export enum Environment {
    Browser = "browser",
    Node = "node",
    Bun = "bun",
    Deno = "deno",
}

// T Y P E S
export type ComposableKey = keyof Composable;
export type LifecycleKey = keyof LifecycleGroups;
export type VerbMethodOptions = Omit<RequestConfig, "url">;

export type StreamedResponse = ReadableStream<Uint8Array> | null;

export type ResponseReturnType<T> =
    | Response
    | StreamedResponse
    | ArrayBuffer
    | Blob
    | string
    | T;
