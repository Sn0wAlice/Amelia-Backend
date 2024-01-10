import { Response } from "../utils/types.ts";

export async function api(path:string, method:string, headers:Headers, body:any) {
    let response:Response = {}

    const args = path.split("/")[2]
    
    switch(args) {
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