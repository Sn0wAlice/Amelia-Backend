import { Response } from "../../utils/types.ts";

export async function interaction_io(path:string, method:string, headers:Headers, body:any) {
    let response:Response = {}

    console.log(body);

    response.body = {
        timestamp: Date.now(),
        path: path,
        method: method,
        error: false,
        talk: {
            needtotalk: true,
            message: "Hello from the other side"
        }
    }

    return response;
}