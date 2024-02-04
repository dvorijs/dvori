export interface ClientConfig extends RequestInit {
    baseURL?: string; // Specify a base URL for all requests made by the client.
    stream?: boolean; // Specify whether to return a ReadableStream instead of a Response.
    composables?: Composable[]; // List of global composables applied to every request.
}

export interface RequestConfig
    extends Omit<ClientConfig, "composables | stream"> {
    url: string; // URL or a path that will be resolved against baseURL if provided.
}

export interface Composable {
    beforeRequest?: (
        config: RequestConfig
    ) => Promise<RequestConfig> | RequestConfig;
    afterResponse?: (response: Response) => Promise<Response> | Response;
    onError?: (error: any) => Promise<any> | any;
    finalize?: () => void;
}

export interface LifecycleGroups {
    beforeRequest: Function[];
    afterResponse: Function[];
    onError: Function[];
    finalize: Function[];
}

export type ComposableKey = keyof Composable;
export type LifecycleKey = keyof LifecycleGroups;
export type VerbMethodOptions = Omit<RequestConfig, "url">;
