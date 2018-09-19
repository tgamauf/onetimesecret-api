/**
 * Module defines generic requests.
 */

'use strict';

const fetch = require('node-fetch');
const buffer = require('buffer');

const API_PATH = 'api';
const FETCH_TIMEOUT_S = 30;


/**
 * Join up the parameters in the dict to conform to
 * application/x-www-form-urlencoded encoding.
 *
 * @param {object} data dictionary of parameters
 * @returns {string} encoded data
 */
function urlEncodeDict(data) {
    const parameters = [];
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            const encodedKey = encodeURIComponent(key);
            const encodedValue = encodeURIComponent(data[key]);
            const parameter = [encodedKey, encodedValue].join('=');
            parameters.push(parameter);
        }
    }

    return parameters.join('&');
}

/**
 * Execute a request using the fetch API and raise an exception if an timeout
 * occurred.
 *
 * @param {string} url request url - passed to fetch
 * @param {object} options fetch options - passed to fetch; default: null
 *  - timeoutS: timeout in seconds of the request; default: null
 *  - init: fetch init parameters
 * @returns {Promise} response object
 * @throws error on timeout and if fetch fails
 */
async function fetchWithTimeout(url, options=null) {
    let fetchTimeout = null;
    let init = null;

    if (typeof(options.timeoutS) !== 'undefined') {
        fetchTimeout = options.timeoutS * 1000;
    }
    if (typeof(options.init) !== 'undefined') {
        init = options.init;
    }

    return new Promise(function (resolve, reject) {
        let didTimeOut = false;
        let timeout = null;

        if (fetchTimeout) {
            timeout = setTimeout(function () {
                    didTimeOut = true;

                    reject(new Error('Request timed out'));
                },
                fetchTimeout);
        }

        fetch(url, init)
            .then((response) => {
                if (timeout) {
                    // Clear the timeout as cleanup
                    clearTimeout(timeout);
                }

                if (!didTimeOut) {
                    resolve(response);
                }
            })
            .catch((error) => {
                console.log('Fetch failed');

                // Rejection already happened with setTimeout
                if (didTimeOut) return;

                reject(error);
            });
    });
}

class ApiRequest {

    /**
     * Create a OTS API request.
     *
     * @abstract
     * @constructor
     * @param {Object} init request parameters
     *  - username: your OTS password
     *  - apiKey: the API key of your OTS account
     *  - url: OTS server url
     *  - apiVersion: API version to use
     * @throws error if username, apiKey, url, or apiVersion not defined
     */
    constructor(init) {
        if (typeof(init.username) === 'undefined') {
            throw new Error('No username defined');
        }
        if (typeof(init.apiKey) === 'undefined') {
            throw new Error('No apiKey defined');
        }
        if (typeof(init.url) === 'undefined') {
            throw new Error('No url defined');
        }
        if (typeof(init.apiVersion) === 'undefined') {
            throw new Error('No apiVersion defined');
        }

        const authorization = (
            'Basic ' + buffer.Buffer.from(init.username + ':' + init.apiKey)
                .toString('base64'));

        this.headers = new fetch.Headers();
        this.headers.append('Authorization', authorization);
        this.headers.append('Accept', 'application/json');
        this.headers.append('Content-Type', 'application/x-www-form-urlencoded');

        this.api_url = [init.url, API_PATH, init.apiVersion].join('/');

        // Must be defined in derived class
        this.PATH = null;
        this.method = null;
        this.body = null;
    }

    /**
     * Prepare an api request.
     *
     * @returns {Array} of format [url, init]
     * @throws error if PATH or method not set
     */
    _prepare() {
        // this.PATH, this.method, and this.body must be set in derived class
        if (!this.PATH)
            throw Error(`PATH not set for request '${this.constructor.name}'`);
        if (!this.method)
            throw Error(`method not set for request '${this.constructor.name}'`);


        const url = [this.api_url, this.PATH].join('/');
        const init = {};
        init.method = this.method;
        init.headers = this.headers;
        if (this.method !== 'GET' && this.body) {
            init.body = this.body;
        }

        return [url, init];
    }

    /**
     * Send the request to the server and wait for the result.
     *
     * @param {object} options send options
     *  - timeoutS: timeout for api request
     * @returns {Promise} that returns a processed response object
     * @throws error on failed request or timeout
     */
    async send(options) {
        const default_options = { timeoutS: FETCH_TIMEOUT_S };

        const [url, init] = this._prepare();

        let response = await fetchWithTimeout(
            url,
            {init: init, ...default_options, ...options});

        if (!response.ok) {
            const contentType = response.headers.get('Content-Type');
            if (contentType && contentType.indexOf('application/json') !== -1) {
                return response.json().then(data => {
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

        response = await response.json();

        return this._process(response);
    }

    /**
     * Process the api request.
     *
     * @param {Object} response object received from the request
     * @returns {Object} processed response object
     */
    _process(response) {
        return response;
    }
}

ApiRequest.urlEncodeDict = urlEncodeDict;

module.exports = exports = ApiRequest;