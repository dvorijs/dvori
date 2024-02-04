import { beforeEach, afterEach, describe, test, expect, vi } from "vitest";
import { defineComposable } from "../../../src/core/defineComposable";

describe("defineComposable", () => {
    afterEach(() => {
        vi.clearAllMocks();
    });
    test("defineComposable returns a composable with the correct lifecycle methods", () => {
        const mockBeforeRequest = vi.fn((config) => config);
        const mockAfterResponse = vi.fn((response) => response);
        const composable = defineComposable({
            beforeRequest: mockBeforeRequest,
            afterResponse: mockAfterResponse,
        });

        expect(composable).toHaveProperty("beforeRequest");
        expect(composable).toHaveProperty("afterResponse");
        expect(composable.beforeRequest).toBe(mockBeforeRequest);
        expect(composable.afterResponse).toBe(mockAfterResponse);
    });

    test("defineComposable throws an error if a lifecycle method is not a function", () => {
        // Expect the function call to throw an error
        expect(() => {
            defineComposable({
                beforeRequest: "notAFunction",
            } as any); // Using 'as any' to bypass TypeScript checks during testing.
        }).toThrow(/Expected 'beforeRequest' to be a function/);
    });

    test("defineComposable allows partial composable definitions", () => {
        const mockAfterResponse = vi.fn((response) => response);
        const composable = defineComposable({
            afterResponse: mockAfterResponse,
        });

        expect(composable).not.toHaveProperty("beforeRequest");
        expect(composable).toHaveProperty("afterResponse");
        expect(composable.afterResponse).toBe(mockAfterResponse);
    });

    test("defineComposable validates composable structure in development mode", () => {
        console.warn = vi.fn();

        const composable = defineComposable({
            invalidKey: vi.fn(),
        } as any); // To simulate passing an unexpected key.

        expect(console.warn).toHaveBeenCalledWith(
            expect.stringContaining("Unexpected key 'invalidKey'")
        );
    });
});
