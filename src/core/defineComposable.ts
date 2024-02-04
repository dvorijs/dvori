import { Composable, ComposableKey } from "../types/index";

// Helper function to define a new composable
export function defineComposable(composableDefinition: Composable): Composable {
    // Ensure the composableDefinition is valid
    const validMethods = [
        "beforeRequest",
        "afterResponse",
        "onError",
        "finalize",
    ];
    Object.keys(composableDefinition).forEach((key) => {
        if (!validMethods.includes(key)) {
            console.warn(
                `Unexpected key '${key}' in the defineComposable functions composableDefinition. Valid keys are: ${validMethods.join(
                    ", "
                )}`
            );
        } else if (
            typeof composableDefinition[key as ComposableKey] !== "function"
        ) {
            throw new Error(`Expected '${key}' to be a function.`);
        }
    });
    return composableDefinition;
}
