import { Response } from "../../utils/types.ts";
import { Plug } from "../plug.ts";

const plug = Plug.getInstance();

export async function interaction_io(path:string, method:string, headers:Headers, body:any) {
    let response:Response = {}


    const search = plug.findPlug(body.command);

    if(search) {
        response = await search.exec(body.initial, body.action, body.command, body.data);

        // add some data to the response
        response.body.timestamp = Date.now();
        response.body.path = path;
        response.body.method = method;
    }

    return response;
}