import { ResponseReturnType, StreamedResponse } from "../types/index";

export function isStreamedResponse(
    response: ResponseReturnType<any>
): response is StreamedResponse {
    return response instanceof ReadableStream || response === null;
}
