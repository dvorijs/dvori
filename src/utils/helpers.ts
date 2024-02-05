import {
    ResponseReturnType,
    StreamedResponse,
    Environment,
} from "../types/index";

// Check if the response is a streamed response
export function isStreamedResponse(
    response: ResponseReturnType<any>
): response is StreamedResponse {
    return response instanceof ReadableStream || response === null;
}

export function detectEnvironment(): Environment {
    if (typeof window !== "undefined") {
        return Environment.Browser;
    }
    // https://bun.sh/guides/util/detect-bun
    if (typeof Bun !== "undefined") {
        return Environment.Bun;
    }

    if (typeof Deno !== "undefined") {
        return Environment.Deno;
    }

    return Environment.Node;
}
