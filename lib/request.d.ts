/**
 * Module defines generic requests.
 */
declare type Method = "GET" | "POST";
interface ApiRequestInit {
    username: string;
    password: string;
    url: string;
    apiVersion: string;
}
interface SendOptions {
    timeoutS?: number;
}
declare class TimeoutError extends Error {
    constructor(message: string);
}
declare class UnknownSecretError extends Error {
    constructor(message: string);
}
declare class NotFoundError extends Error {
    constructor(message: string);
}
declare class NotAuthorizedError extends Error {
    constructor(message: string);
}
declare class RateLimitedError extends Error {
    constructor(message: string);
}
declare class InternalServerError extends Error {
    constructor(message: string);
}
declare class NetworkError extends Error {
    constructor(message: string);
}
declare class InputError extends Error {
    constructor(message: string);
}
/**
 * Join up the parameters in the dict to conform to
 * application/x-www-form-urlencoded encoding.
 *
 * @param data dictionary of parameters
 * @returns encoded data
 */
declare function urlEncodeDict(data: object): string;
declare class ApiRequest {
    protected readonly keyRegex: RegExp;
    protected path: string;
    protected method: Method;
    protected body?: any;
    private readonly headers;
    private apiUrl;
    /**
     * Create a OTS API request.
     *
     * @abstract
     * @constructor
     * @param init request parameters
     * @throws error if username, apiKey, url, or apiVersion not defined
     */
    constructor(init: ApiRequestInit);
    /**
     * Send the request to the server and wait for the result.
     *
     * @param options send options
     * @returns that returns a processed response object
     * @throws error on failed request or timeout
     */
    send(options?: SendOptions): Promise<any>;
    /**
     * Prepare an api request.
     *
     * @returns of format [url, init]
     * @throws error if path or method not set
     */
    protected prepare(): any[];
    /**
     * Process the api request.
     *
     * @static
     * @param response object received from the request
     * @returns processed response object
     */
    protected process(response: object): any;
    /**
     * Check the if the provided key is valid.
     *
     * @param key key to check
     * @raises InputError if an invalid key has been provided
     */
    protected checkValidKey(key?: string): void;
}
export { InputError, InternalServerError, NetworkError, NotFoundError, NotAuthorizedError, RateLimitedError, TimeoutError, UnknownSecretError, Method, ApiRequest, ApiRequestInit, urlEncodeDict, };
