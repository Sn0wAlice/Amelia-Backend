export interface Config {
    token: string;
}

export interface Response {
    status?: number;
    body?: any;
    headers?: Headers;
}