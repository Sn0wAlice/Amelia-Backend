import { Response } from "../utils/types.ts";

// local import
import { interaction_shell } from "./mods/shell.ts";
import { interaction_io } from "./mods/io.ts";

export async function api(path:string, method:string, headers:Headers, body:any) {
    let response:Response = {}

    const args = path.split("/")[2]
    
    switch(args) {
        case "shell":
            response = await interaction_shell(path, method, headers, body);
            break;
        case "io":
            response = await interaction_io(path, method, headers, body);
            break;
        case "ping":
            response.body = {
                error: false,
                message: "pong"
            }
            break;
        default:
            response.body = {
                error: true,
                message: "Invalid endpoint",
                talk: {
                    needtotalk: false
                }
            }
            break;
    }


    response.headers = new Headers();
    response.headers.set("content-type", "application/json");

    return response;
}