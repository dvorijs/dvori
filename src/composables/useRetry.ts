// import { defineComposable } from "../core/defineComposable";
// import type { RequestConfig } from "../types/index";

// enum RetryStrategy {
//     Immediate = "immediate",
//     Linear = "linear",
//     Exponential = "exponential",
// }

// function calculateExponentialDelay(retries: number, delay: number) {
//     const backoffRate = Math.pow(2, retries);
//     return delay * backoffRate;
// }

// async function wait(ms: number) {
//     return new Promise((resolve) => setTimeout(resolve, ms));
// }

// export function useRetry(
//     retries = 3,
//     strategy: RetryStrategy = RetryStrategy.Exponential,
//     delay = 1000
// ) {
//     return defineComposable({
//         async onError(error: any, {client, retry, state, cancel}) {
//             if (retries <= 0) {
//                 return error;
//             }
//             retries--;

//             // TODO
//             await delay(calculateExponentialDelay());
//         },
//     });
// }

// const response = client.get('/url', {composable: [useRetry()]});
