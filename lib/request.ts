/**
 * Module defines generic requests.
 */


'use strict';

import {isUndefined} from "util";
import fetch, {Headers, Response} from 'node-fetch';
import {Buffer} from 'buffer';

const API_PATH: string = 'api';
const FETCH_TIMEOUT_S: number = 30;

type Method = 'GET' | 'POST';

interface FetchInit {
    method: Method,
    headers?: Headers,
    body?: any
}

interface FetchWithTimeoutOptions {
    init?: FetchInit,
    timeoutS?: number
}

interface ApiRequestInit {
    username: string,
    password: string,
    url: string,
    apiVersion: string
}

interface SendOptions {
    timeoutS?: number
}

interface JsonErrorResponse {
    message: string
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
            const parameter: string = [encodedKey, encodedValue].join('=');
            parameters.push(parameter);
        }
    }

    return parameters.join('&');
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

    // TODO resolve should be of type Response and reject of type Error imho, but this doesn't work
    return new Promise(function (resolve: any, reject: any): void {
        let didTimeOut: boolean = false;
        let timeout: any;

        if (!isUndefined(fetchTimeout)) {
            timeout = setTimeout(function (): void {
                    didTimeOut = true;

                    reject(new Error('Request timed out'));
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
            .catch((error): void => {
                  // Rejection already happened with setTimeout
                if (didTimeOut) return;

                reject(error);
            });
    });
}

class ApiRequest {
    private readonly headers: Headers;
    private apiUrl: string;

    protected path: string;
    protected method: Method;
    protected body?: any;

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
            'Basic ' + Buffer.from(init.username + ':' + init.password)
                .toString('base64'));

        this.headers = new Headers();
        this.headers.append('Authorization', authorization);
        this.headers.append('Accept', 'application/json');
        this.headers.append('Content-Type', 'application/x-www-form-urlencoded');

        this.apiUrl = [init.url, API_PATH, init.apiVersion].join('/');
    }

    /**
     * Prepare an api request.
     *
     * @returns of format [url, init]
     * @throws error if path or method not set
     */
    protected prepare(): any[] {
        const url: string = [this.apiUrl, this.path].join('/');
        const init: FetchInit = {
            method: this.method,
            headers: this.headers
        };
        if (this.method !== 'GET' && this.body) {
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
    protected static process(response: object): any {
        return response;
    }

    /**
     * Send the request to the server and wait for the result.
     *
     * @param options send options
     * @returns that returns a processed response object
     * @throws error on failed request or timeout
     */
    async send(options?: SendOptions) {
        const defaultOptions: SendOptions = {timeoutS: FETCH_TIMEOUT_S};

        const [url, init] = this.prepare();

        const response: Response = await fetchWithTimeout(
            url,
            {init: init, ...defaultOptions, ...options});

        if (!response.ok) {
            const contentType: string = response.headers.get('Content-Type');
            if (contentType && contentType.indexOf('application/json') !== -1) {
                return response.json().then((data: JsonErrorResponse): void => {
                    throw new Error(
                        `url='${url}', status=${response.status}, `
                        + `message='${data.message}'`);
                });
            } else {
                throw new Error(
                    `url='${url}', status=${response.status}, `
                    + `message='${response.statusText}'`);
            }
        }

        const jsonResponse: object = await response.json();

        return ApiRequest.process(jsonResponse);
    }
}

export {
    Method,
    ApiRequestInit,
    urlEncodeDict,
    ApiRequest
};
