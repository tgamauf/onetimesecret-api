declare class Headers {
    private readonly data;
    constructor();
    append(key: any, value: any): void;
    get(key: any): any;
}
declare class Response {
    private readonly body;
    private ok;
    private status;
    private statusText;
    private headers;
    constructor(body: any, init: any);
    json(): Promise<{}>;
}
declare function fetch(url: any, init: any): Promise<{}>;
export { Headers, Response, };
export default fetch;
