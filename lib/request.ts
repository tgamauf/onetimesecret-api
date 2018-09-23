/**
 * Module defines generic requests.
 */

"use strict";

import {Buffer} from "buffer";
import fetch, {Headers, Response} from "node-fetch";
import {isUndefined} from "util";

const API_PATH: string = "api";
const FETCH_TIMEOUT_S: number = 30;

type Method = "GET" | "POST";

interface FetchInit {
    method: Method;
    headers?: Headers;
    body?: any;
}

interface FetchWithTimeoutOptions {
    init?: FetchInit;
    timeoutS?: number;
}

interface ApiRequestInit {
    username: string;
    password: string;
    url: string;
    apiVersion: string;
}

interface SendOptions {
    timeoutS?: number;
}

interface JsonErrorResponse {
    message: string;
}


class TimeoutError extends Error {
    constructor(message: string) {
        super(message);

        Object.setPrototypeOf(this, TimeoutError.prototype);
    }
}

class UnknownSecretError extends Error {
    constructor(message: string) {
        super(message);

        Object.setPrototypeOf(this, UnknownSecretError.prototype);
    }
}

class NotFoundError extends Error {
    constructor(message: string) {
        super(message);

        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
}

class NotAuthorizedError extends Error {
    constructor(message: string) {
        super(message);

        Object.setPrototypeOf(this, NotAuthorizedError.prototype);
    }
}

class RateLimitedError extends Error {
    constructor(message: string) {
        super(message);

        Object.setPrototypeOf(this, RateLimitedError.prototype);
    }
}

class InternalServerError extends Error {
    constructor(message: string) {
        super(message);

        Object.setPrototypeOf(this, InternalServerError.prototype);
    }
}


/**
 * Join up the parameters in the dict to conform to
 * application/x-www-form-urlencoded encoding.
 *
 * @param data dictionary of parameters
 * @returns encoded data
 */
function urlEncodeDict(data: object): string {
    const parameters: string[] = [];
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            const encodedKey: string = encodeURIComponent(key);
            const encodedValue: string = encodeURIComponent(data[key]);
            const parameter: string = [encodedKey, encodedValue].join("=");
            parameters.push(parameter);
        }
    }

    return parameters.join("&");
}

/**
 * Execute a request using the fetch API and raise an exception if an timeout
 * occurred.
 *
 * @param url request url - passed to fetch
 * @param options fetch options - passed to fetch
 * @returns response object
 * @throws error on timeout and if fetch fails
 */
async function fetchWithTimeout(
    url: string,
    // TODO Promise should actually be type Response, but this doesn't work
    options?: FetchWithTimeoutOptions): Promise<any> {
    let fetchTimeout: number;
    let init: FetchInit;

    if (!isUndefined(options.timeoutS)) {
        fetchTimeout = options.timeoutS * 1000;
    }
    if (!isUndefined(options.init)) {
        init = options.init;
    }

    return new Promise((resolve: Function, reject: Function): void => {
        let didTimeOut: boolean = false;
        let timeout: any;

        if (!isUndefined(fetchTimeout)) {
            timeout = setTimeout((): void => {
                    didTimeOut = true;

                    reject(new TimeoutError("Request timed out"));
                },
                fetchTimeout);
        }

        fetch(url, init)
            .then((response: Response): void => {
                if (timeout) {
                    // Clear the timeout as cleanup
                    clearTimeout(timeout);
                }

                if (!didTimeOut) {
                    resolve(response);
                }
            })
            .catch((error: any): void => {
                // Rejection already happened with setTimeout
                if (didTimeOut) {
                    return;
                }

                reject(error);
            });
    });
}

class ApiRequest {
    protected path: string;
    protected method: Method;
    protected body?: any;

    private readonly headers: Headers;
    private apiUrl: string;

    /**
     * Create a OTS API request.
     *
     * @abstract
     * @constructor
     * @param init request parameters
     * @throws error if username, apiKey, url, or apiVersion not defined
     */
    public constructor(init: ApiRequestInit) {
        const authorization: string = (
            "Basic " + Buffer.from(init.username + ":" + init.password)
                .toString("base64"));

        this.headers = new Headers();
        this.headers.append("Authorization", authorization);
        this.headers.append("Accept", "application/json");
        this.headers.append("Content-Type", "application/x-www-form-urlencoded");

        this.apiUrl = [init.url, API_PATH, init.apiVersion].join("/");
    }

    /**
     * Send the request to the server and wait for the result.
     *
     * @param options send options
     * @returns that returns a processed response object
     * @throws error on failed request or timeout
     */
    public async send(options?: SendOptions) {
        const defaultOptions: SendOptions = {timeoutS: FETCH_TIMEOUT_S};

        const [url, init] = this.prepare();

        const response: Response = await fetchWithTimeout(
            url,
            {init, ...defaultOptions, ...options});

        if (!response.ok) {
            if (response.status === 500) {
                throw new InternalServerError(
                    `url="${url}", status=${response.status}, `
                    + `message="${response.statusText}"`);
            }

            if (isUndefined(response.headers)) {
                throw new Error(
                    `url='${url}', status=${response.status}, `
                    + `message='${response.statusText}', headers missing`);
            }

            const contentType: string = response.headers.get("Content-Type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                return response.json().then((data: JsonErrorResponse): void => {
                    let error: Error;

                    switch (data.message) {
                        case "Unknown secret":
                            error = new UnknownSecretError("Unknown secret");
                            break;
                        case "Not Found":
                            error = new NotFoundError("Metadata not found");
                            break;
                        case "Not authorized":
                            error = new NotAuthorizedError("Request not authorized");
                            break;
                        case "Apologies dear citizen! You have been rate limited.":
                            error = new RateLimitedError("You have been rate limited.");
                            break;
                        default:
                            error = new Error(
                                `url="${url}", status=${response.status}, `
                                + `message="${data.message}"`);
                    }

                    throw error;
                });
            } else {
                let error: Error = null;
                switch(response.statusText) {
                    case "Not Found":
                        error = new NotFoundError("Path not found");
                        break;
                    default:
                        error = new Error(
                            `url="${url}", status=${response.status}, `
                            + `message="${response.statusText}"`);
                }

                throw error;
            }
        }

        const jsonResponse: object = await response.json();

        return this.process(jsonResponse);
    }

    /**
     * Prepare an api request.
     *
     * @returns of format [url, init]
     * @throws error if path or method not set
     */
    protected prepare(): any[] {
        const url: string = [this.apiUrl, this.path].join("/");
        const init: FetchInit = {
            headers: this.headers,
            method: this.method,
        };
        if (this.method !== "GET" && this.body) {
            init.body = this.body;
        }

        return [url, init];
    }

    /**
     * Process the api request.
     *
     * @static
     * @param response object received from the request
     * @returns processed response object
     */
    protected process(response: object): any {
        return response;
    }
}

export {
    TimeoutError,
    UnknownSecretError,
    NotFoundError,
    NotAuthorizedError,
    RateLimitedError,
    InternalServerError,
    Method,
    ApiRequestInit,
    urlEncodeDict,
    ApiRequest
};
