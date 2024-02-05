import * as esbuild from "esbuild";

// Common build settings
const entryPoint = "src/index.ts";
const commonOptions = {
    entryPoints: [entryPoint],
    bundle: true,
    minify: true,
    sourcemap: true,
};

// Define builds for various environments
const builds = [
    // ESM build for Node and Deno
    {
        ...commonOptions,
        outfile: "dist/dvori.esm.js",
        format: "esm",
        platform: "neutral",
    },
    // CommonJS build for Node
    {
        ...commonOptions,
        outfile: "dist/dvori.cjs.js",
        format: "cjs",
        platform: "node",
    },
    // IIFE build for browsers
    {
        ...commonOptions,
        outfile: "dist/dvori.browser.js",
        format: "iife",
        globalName: "Dvori",
        platform: "browser",
    },
    // Optionally, additional configurations for Deno or specific builds
    // Adjust according to your project's needs
];

// Execute each build
builds.forEach((build) => {
    esbuild.build(build).catch(() => process.exit(1));
});
