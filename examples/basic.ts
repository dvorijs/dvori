import { defineClient } from "..";

interface JSONResponseType {
    slideshow: any;
}

const client = defineClient({
    baseURL: "https://httpbin.org",
});

async function getRequset(): Promise<void> {
    const data = await client.get<JSONResponseType>("/json");
    console.log(data.slideshow);
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
