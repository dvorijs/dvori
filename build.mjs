#!/usr/bin/env node

import * as esbuild from "esbuild";
import { exec } from "child_process";

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
        outfile: "dist/dvori.mjs",
        format: "esm",
        platform: "neutral",
    },
    // CommonJS build for Node
    {
        ...commonOptions,
        outfile: "dist/dvori.cjs",
        format: "cjs",
        platform: "node",
        target: "node18",
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

// Function to execute a shell command
function runCommand(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return reject(stderr);
            }
            console.log(stdout);
            resolve(stdout);
        });
    });
}

// Execute each build with ESBuild
async function build() {
    for (const build of builds) {
        try {
            await esbuild.build(build);
        } catch (error) {
            console.error(error);
            process.exit(1);
        }
    }

    // After ESBuild, generate types with tsc
    try {
        await runCommand("tsc -p tsconfig.json");
        console.log("Type declarations generated.");
    } catch (error) {
        console.error("Failed to generate type declarations:", error);
        process.exit(1);
    }
}

build();
