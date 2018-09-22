declare class Headers {
    data: object;
    constructor();
    append(key: any, value: any): void;
    get(key: any): any;
}
declare class Response {
    body: any;
    ok: boolean;
    status: number;
    statusText: string;
    headers: Headers;
    constructor(body: any, init: any);
    json(): Promise<{}>;
}
declare function fetch(url: any, init: any): Promise<{}>;
export { Headers, Response, };
export default fetch;
