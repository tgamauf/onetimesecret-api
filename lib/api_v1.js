/**
 * API version 1 implementation.
 */

'use strict';

const ApiRequest = require('./request.js');


class ApiRequestStatus extends ApiRequest {


    /**
     * Check server status.
     *
     * @constructor
     * @augments ApiRequest
     * @param {Object} init initialization object that must contain
     *  - username: username to use for request
     *  - apiKey: api key to use for request
     *  - url: server url
     *  - apiVersion: api version to use for request
     * */
    constructor(init) {
        super(init);

        this.PATH = 'status';
        this.method = 'GET';
    }

    /**
     * Process the api request.
     *
     * @param {Object} response object received from the request
     * @returns {boolean} true if server is available
     */
    _process(response) {
        let isAvailable = false;
        if (response.status === 'nominal') {
            isAvailable = true;
        }

        return isAvailable;
    }
}

class ApiRequestShare extends ApiRequest {

    /**
     * Send text to server for sharing.
     *
     * @constructor
     * @augments ApiRequest
     * @param {Object} init additional parameters to base class:
     * - secret: secret to share
     * - passphrase: passphrase for secret (optional)
     * - ttl: time to live of secret (optional)
     * - recipient: optional recipient of secret (optional)
     * */
    constructor(init) {
        super(init);

        let body = { secret: init.secret };
        if (init.passphrase !== undefined) {
            body.passphrase = init.passphrase;
        }
        if (init.ttl !== undefined) {
            body.ttl = init.ttl;
        }
        if (init.recipient !== undefined) {
            body.recipient = init.recipient;
        }

        this.PATH = 'share';
        this.method = 'POST';
        this.body = ApiRequest.urlEncodeDict(body);
    }
}

class ApiRequestGenerate extends ApiRequest {

    /** Request a short, unique secret for sharing.
     *
     * @constructor
     * @augments ApiRequest
     * @param {Object} init additional parameters to base class:
     * - passphrase: passphrase for secret (optional)
     * - ttl: time to live of secret (optional)
     * - recipient: optional recipient of secret (optional)
     * */
    constructor(init) {
        super(init);

        let body = null;
        if (init.passphrase !== undefined) {
            if (!body) {
                body = {};
            }

            body.passphrase = init.passphrase;
        }
        if (init.ttl !== undefined) {
            if (!body) {
                body = {};
            }

            body.ttl = init.ttl;
        }
        if (init.recipient !== undefined) {
            if (!body) {
                body = {};
            }

            body.recipient = init.recipient;
        }

        this.PATH = 'generate';
        this.method = 'POST';
        if (body) {
            this.body = ApiRequest.urlEncodeDict(body);
        }
    }
}

class ApiRequestRetrieveSecret extends ApiRequest {

    /**
     * Retrieve a secret.
     *
     * @constructor
     * @augments ApiRequest
     * @param {Object} init additional parameters to base class:
     * - secret_key: secret key of the secret to retrieve
     * - passphrase: passphrase for secret (optional)
     *
     * Raises: if no secret_key was defined
     * */
    constructor(init) {
        super(init);

        this.PATH = [ 'secret', init.secret_key ].join('/');
        this.method = 'POST';
        if (init.passphrase !== undefined) {
            this.body = ApiRequest.urlEncodeDict(
                { passphrase: init.passphrase });
        }
    }
}

class ApiRequestRetrieveMetadata extends ApiRequest {

    /**
     * Retrieve metadata for a secret.
     *
     * @constructor
     * @augments ApiRequest
     * @param {Object} init additional parameters to base class:
     * - metadata_key: secret key of the secret to retrieve
     */
    constructor(init) {
        super(init);

        this.PATH = [ 'private', init.metadata_key ].join('/');
        this.method = 'POST';
    }
}

class ApiRequestBurn extends ApiRequest {

    /**
     * Burn a secret.
     *
     * @constructor
     * @augments ApiRequest
     * @param {Object} init additional parameters to base class:
     * - metadata_key: secret key of the secret to burn
     */
    constructor(init) {
        super(init);

        this.PATH = [ 'private', init.metadata_key, 'burn' ].join('/');
        this.method = 'POST';
    }
}

class ApiRequestRecentMetadata extends ApiRequest {

    /**
     * Fetch secret metadata from the server.
     *
     * @constructor
     * @augments ApiRequest
     */
    constructor(init) {
        super(init);

        this.PATH = 'private/recent';
        this.method = 'GET';
    }
}

module.exports = {
    ApiRequestStatus: ApiRequestStatus,
    ApiRequestShare: ApiRequestShare,
    ApiRequestGenerate: ApiRequestGenerate,
    ApiRequestBurn: ApiRequestBurn,
    ApiRequestRetrieveSecret: ApiRequestRetrieveSecret,
    ApiRequestRetrieveMetadata: ApiRequestRetrieveMetadata,
    ApiRequestRecentMetadata: ApiRequestRecentMetadata
};
