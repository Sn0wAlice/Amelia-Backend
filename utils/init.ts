import { generateRandomString } from "./functions.ts";
import { logs } from './logs.ts';

import { Config } from "./types.ts";

export async function init() {

    let config:Config
    // check if config file exists
    // if not, create it
    try {
        config = JSON.parse(Deno.readTextFileSync("./config.json"));
    } catch(error) {
        config = generateDefaultConfig();
        Deno.writeTextFileSync("./config.json", JSON.stringify(config));
        logs.info("Created config file, please get your token from it and put it in the header of your requests");
        logs.info("Please restart the server after you have done this");
        Deno.exit(0);
    }

    return config;
    
}



function generateDefaultConfig() {
    return {
        "token": `${generateRandomString(12)}-${generateRandomString(6)}-${generateRandomString(8)}-${generateRandomString(16)}`,
    }
}