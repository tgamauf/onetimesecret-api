/**
 * API version 1 implementation.
 */


'use strict';

import {isUndefined} from "util";
import {ApiRequestInit, ApiRequest, urlEncodeDict} from "./request";


interface StatusObject extends Object {
    status: string
}

interface ShareInit extends ApiRequestInit {
    secret: string,
    passphrase?: string,
    ttl?: number,
    recipient?: string
}

interface ShareBody {
    secret: string,
    passphrase?: string,
    ttl?: number,
    recipient?: string
}

interface GenerateInit extends ApiRequestInit {
    passphrase?: string,
    ttl?: number,
    recipient?: string
}

interface GenerateBody {
    passphrase?: string,
    ttl?: number,
    recipient?: string
}

interface RetrieveSecretInit extends ApiRequestInit {
    secret_key: string
    passphrase?: string,
}

interface RetrieveSecretBody {
    passphrase?: string
}

interface RetrieveMetadataInit extends ApiRequestInit {
    metadata_key: string
}

interface BurnInit extends ApiRequestInit {
    metadata_key: string
}


class ApiRequestStatus extends ApiRequest {

    /**
     * Check server status.
     *
     * @constructor
     * @augments ApiRequest
     * */
    constructor(init: ApiRequestInit) {
        super(init);

        this.path = 'status';
        this.method = 'GET';
    }

    /**
     * Process the api request.
     *
     * @param response object received from the request
     * @returns true if server is available
     */
    protected static process(response: StatusObject): boolean {
        let isAvailable: boolean = false;
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
     * */
    constructor(init: ShareInit) {
        super(init);

        const body: ShareBody = {secret: init.secret};
        if (!isUndefined(init.passphrase)) {
            body.passphrase = init.passphrase;
        }
        if (!isUndefined(init.ttl)) {
            body.ttl = init.ttl;
        }
        if (!isUndefined(init.recipient)) {
            body.recipient = init.recipient;
        }

        this.path = 'share';
        this.method = 'POST';
        this.body = urlEncodeDict(body);
    }
}

class ApiRequestGenerate extends ApiRequest {

    /** Request a short, unique secret for sharing.
     *
     * @constructor
     * @augments ApiRequest
     * */
    constructor(init: GenerateInit) {
        super(init);

        const body: GenerateBody = {};
        if (!isUndefined(init.passphrase)) {
            body.passphrase = init.passphrase;
        }
        if (!isUndefined(init.ttl)) {
            body.ttl = init.ttl;
        }
        if (!isUndefined(init.recipient)) {
            body.recipient = init.recipient;
        }

        this.path = 'generate';
        this.method = 'POST';
        if (Object.keys(body).length > 0) {
            this.body = urlEncodeDict(body);
        }
    }
}

class ApiRequestRetrieveSecret extends ApiRequest {

    /**
     * Retrieve a secret.
     *
     * @constructor
     * @augments ApiRequest
     * */
    constructor(init: RetrieveSecretInit) {
        super(init);

        const body: RetrieveSecretBody = {};
        if (!isUndefined(init.passphrase)) {
            body.passphrase = init.passphrase;
        }

        this.path = ['secret', init.secret_key].join('/');
        this.method = 'POST';
        if (Object.keys(body).length > 0) {
            this.body = urlEncodeDict(body);
        }
    }
}

class ApiRequestRetrieveMetadata extends ApiRequest {

    /**
     * Retrieve metadata for a secret.
     *
     * @constructor
     * @augments ApiRequest
     */
    constructor(init: RetrieveMetadataInit) {
        super(init);

        this.path = ['private', init.metadata_key].join('/');
        this.method = 'POST';
    }
}

class ApiRequestBurn extends ApiRequest {

    /**
     * Burn a secret.
     *
     * @constructor
     * @augments ApiRequest
     */
    constructor(init: BurnInit) {
        super(init);

        this.path = ['private', init.metadata_key, 'burn'].join('/');
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
    constructor(init: ApiRequestInit) {
        super(init);

        this.path = 'private/recent';
        this.method = 'GET';
    }
}

export {
    ApiRequestStatus,
    ApiRequestShare,
    ApiRequestGenerate,
    ApiRequestBurn,
    ApiRequestRetrieveSecret,
    ApiRequestRetrieveMetadata,
    ApiRequestRecentMetadata
};
