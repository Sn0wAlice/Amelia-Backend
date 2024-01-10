const Error418 = new Response("I'm a teapot", { status: 418 });
const server = Deno.listen({ port: 8099, hostname: "0.0.0.0" });
console.log(Deno.readTextFileSync("./utils/ascii.art"));

import { api } from "./api/main.ts";
import { logs } from "./utils/logs.ts";
import { init } from "./utils/init.ts";
const config = await init();

async function main(request:Request) {
    const url = new URL(request.url),
        method = request.method,
        path = url.pathname,
        headers = request.headers;

    // Check the header authorization
    if(!headers.has("authorization")) {
        return Error418;
    }

    // Check if the token is correct
    if(headers.get("authorization") != config.token) {
        return Error418;
    }

    let body = null;
    if(method == "POST") {
        if(headers.get("content-type") == "application/json") {
            try { body = await request.json(); } catch (error) {}
        }
    }

    logs.info(`${method} ${path}`);

    if(path.startsWith("/api")) {
        return await api(path, method, headers, body);
    }
    
    return Error418;
}

for await (const conn of server) {
    (async (httpConn: Deno.HttpConn) => {
        for await (const { request, respondWith } of httpConn) {
            if (request.method != "GET" && request.method != "POST") { // we do not support other methods
                await respondWith(Error418);
                continue;
            }

            const { status, body, headers } = await main(request);

            const data = body instanceof Blob ? body
                : body instanceof ArrayBuffer ? body
                : body instanceof Uint8Array ? body
                : typeof body == "string" ? body
                : JSON.stringify(body);

            const response = new Response(data, { status: status ? status : 200, headers });

            await respondWith(response);
        }
    })(Deno.serveHttp(conn));
}