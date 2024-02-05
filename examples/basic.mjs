import { defineClient } from "../dist/dvori.esm.js";

const client = defineClient({
    baseURL: "https://httpbin.org",
});

async function getRequset() {
    const data = await client.get("/get");
    console.log(data);
    const data2 = await fetch("https://httpbin.org/get");
    console.log(data2);
}

// GET request with query params
async function getRequsetWithParams() {
    const data = await client.get("/get", {
        params: {
            bacon: "ator",
        },
    });
    console.log(data);
}

async function main() {
    await getRequset();
    // await getRequsetWithParams();
}
main();
