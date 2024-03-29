import { defineClient } from "../dist/dvori.esm.js";

const client = defineClient({
    baseURL: "https://httpbin.org",
});

async function getRequset() {
    const data = await client.get("/json");
    console.log(data.slideshow);
    //     const data2 = await fetch("https://httpbin.org/json");
    //     console.log(await data2.json());
}

// GET request with query params
async function getRequsetWithParams() {
    const data = await client.get("/get", {
        params: {
            bacon: "ator",
        },
    });
    // console.log(data);
}

async function main() {
    await getRequset();
    // await getRequsetWithParams();
}
main();
