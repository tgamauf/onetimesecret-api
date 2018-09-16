"use strict";

import fetch, {Headers} from "node-fetch";
import {Buffer} from "buffer";

const API_PATH = "api";
const FETCH_TIMEOUT_S = 30;


function url_encode_dict(data) {
    /**
     * Join up the parameters in the dict to conform to
     * application/x-www-form-urlencoded encoding.
     *
     * Parameter:
     * - data: dictionary of parameters
     *
     * Returns: encoded data
     */

    let parameters = [];
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            let value = data[key];
            let parameter = [key, value].join("=");
            parameters.push(parameter);
        }
    }

    return parameters.join("&");
}

async function fetchWithTimeout(url, options = null) {
    /**
     * Execute a request using the fetch API and raise an exception if an timeout
     * occured.
     *
     * Parameter:
     * - url: request url - passed to fetch
     * - init: options object - passed to fetch; default: null
     * - timeout_s: timeout in secondds of the request; default: null
     *
     * Returns: promise that returns response object
     */

    let fetch_timeout = null;
    let init = null;

    if (options.timeout_s !== undefined) {
        fetch_timeout = options.timeout_s * 1000;
    }
    if (options.init !== undefined) {
        init = options.init;
    }

    return new Promise(function (resolve, reject) {
        let did_time_out = false;
        let timeout = null;

        if (fetch_timeout) {
            timeout = setTimeout(function () {
                    did_time_out = true;

                    reject(new Error("Request timed out"));
                },
                fetch_timeout);
        }

        fetch(url, init)
            .then((response) => {
                if (timeout) {
                    // Clear the timeout as cleanup
                    clearTimeout(timeout);
                }

                if (!did_time_out) {
                    console.debug("Fetch ok");

                    resolve(response);
                }
            })
            .catch((error) => {
                console.log("Fetch failed");

                // Rejection already happened with setTimeout
                if (did_time_out) return;

                reject(error);
            });
    });
}

class ApiRequest {
    constructor(init) {
        /**
         * Create a OTS API request.
         *
         * Parameter:
         * - init: init parameters
         *      - username: your OTS password
         *      - api_key: the API key of your OTS account
         *      - url: OTS server url
         *      - api_version: API version to use
         *
         * Raises: username, api_key, url, or api_version not defined
         */

        console.debug(`${this.constructor.name} username=${init.username}, api_key=${init.api_key}, url=${init.url}, api_version=${init.api_version}`);

        if (init.username === undefined) {
            throw new Error("No username defined");
        }
        if (init.api_key === undefined) {
            throw new Error("No api_key defined");
        }
        if (init.url === undefined) {
            throw new Error("No url defined");
        }
        if (init.api_version === undefined) {
            throw new Error("No api_version defined");
        }

        let authorization = "Basic " + Buffer.from(init.username + ":" + init.api_key)
            .toString("base64");

        this.headers = new Headers();
        this.headers.append("Authorization", authorization);
        this.headers.append("Accept", "application/json");
        this.headers.append("Content-Type", "application/x-www-form-urlencoded");

        this.api_url = [init.url, API_PATH, init.api_version].join("/");

        // Must be defined in derived class
        this.PATH = null;
        this.method = null;
        this.body = null;
    }

    prepare() {
        /**
         * Prepare an api request.
         *
         * Returns: array of format [url, init]
         *
         * Raises: PATH or method not set
         */

        console.debug(`${this.constructor.name} prepare`);

        // this.PATH, this.method, and this.body must be set in derived class
        if (!this.PATH)
            throw Error(`PATH not set for request '${this.constructor.name}'`);
        if (!this.method)
            throw Error(`method not set for request '${this.constructor.name}'`);


        let url = [this.api_url, this.PATH].join("/");
        let init = {};
        init.method = this.method;
        init.headers = this.headers;
        if (this.method !== "GET" && this.body) {
            init.body = this.body;
        }

        console.debug(`Method: ${this.method.toString()}`);
        console.debug(`Headers: ${this.headers.toString()}`);
        if (this.body) {
            console.debug(`Body: ${this.body.toString()}`);
        }
        console.debug(`Url: ${url}`);

        return [url, init];
    }

    async send(timeout = FETCH_TIMEOUT_S) {
        /**
         * Send the request to the server and wait for the result.
         *
         * Returns: processed response object
         *
         * Returns: promise that returns response object
         *
         * Raises: on failed request or timeout
         */

        let prepared = this.prepare();
        let url = prepared[0];
        let init = prepared[1];

        let response = await fetchWithTimeout(
            url,
            {init: init, timeout_s: timeout});

        if (!response.ok) {
            const contentType = response.headers.get("Content-Type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                return response.json().then(data => {
                    throw new Error(`url='${url}', status=${response.status}, message='${data.message}'`);
                });
            } else {
                throw new Error(`url='${url}', status=${response.status}, message='${response.statusText}'`);
            }
        }

        response = await response.json();

        return this._process(response);
    }

    _process(response) {
        /**
         * Process the api request.
         *
         * Parameter:
         * - response: response object received from the request
         *
         * Returns: processed reponse object
         */

        console.debug(`${this.constructor.name} process`);

        return response;
    }
}

export { url_encode_dict };
export default ApiRequest;
