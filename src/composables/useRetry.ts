import { defineComposable } from "../core/defineComposable";

interface RetryProps {
    retries?: number;
    strategy?: "immediate" | "linear" | "exponential";
    delay?: number;
}

function calculateExponentialDelay(currentRetry: number, delay: number = 100) {
    const backoffRate = Math.pow(2, currentRetry);
    return delay * backoffRate;
}

async function wait(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// TODO: Add retry on status code, ex: [500, 503]
export function useRetry({
    retries = 3,
    strategy = "exponential",
    delay = 100,
}: RetryProps | undefined = {}) {
    return defineComposable({
        async onError(error, { retry }) {
            if (retries <= 0) {
                throw error;
            }
            console.log(`${retries} retries left`);

            if (strategy === "linear") {
                await wait(delay);
            }
            // Exponential is the default strategy
            else {
                await wait(calculateExponentialDelay(retries, delay));
            }

            retries--;

            return await retry();
        },
    });
}
