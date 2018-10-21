/**
 * API version 1 implementation.
 */

"use strict";

import {ApiRequest, ApiRequestInit, urlEncodeDict} from "./request";


interface StatusObject extends Object {
    status: string;
}

interface ShareInit extends ApiRequestInit {
    secret: string;
    passphrase?: string;
    ttl?: number;
    recipient?: string;
}

interface ShareBody {
    secret: string;
    passphrase?: string;
    ttl?: number;
    recipient?: string;
}

interface GenerateInit extends ApiRequestInit {
    passphrase?: string;
    ttl?: number;
    recipient?: string;
}

interface GenerateBody {
    passphrase?: string;
    ttl?: number;
    recipient?: string;
}

interface RetrieveSecretInit extends ApiRequestInit {
    secretKey: string;
    passphrase?: string;
}

interface RetrieveSecretBody {
    passphrase?: string;
}

interface RetrieveMetadataInit extends ApiRequestInit {
    metadataKey: string;
}

interface BurnInit extends ApiRequestInit {
    metadataKey: string;
}


class ApiRequestStatus extends ApiRequest {

    /**
     * Check server status.
     *
     * @constructor
     * @augments ApiRequest
     */
    constructor(init: ApiRequestInit) {
        super(init);

        this.path = "status";
        this.method = "GET";
    }

    /**
     * Convert server status to boolean.
     *
     * @param response object received from the request
     * @returns true if server is available
     */
    protected process(response: StatusObject): boolean {
        let isAvailable: boolean = false;
        if (response.status === "nominal") {
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
     */
    constructor(init: ShareInit) {
        super(init);

        const body: ShareBody = {secret: init.secret};
        if (typeof init.passphrase !== "undefined") {
            body.passphrase = init.passphrase;
        }
        if (typeof init.ttl !== "undefined") {
            body.ttl = init.ttl;
        }
        if (typeof init.recipient !== "undefined") {
            body.recipient = init.recipient;
        }

        this.path = "share";
        this.method = "POST";
        this.body = urlEncodeDict(body);
    }
}

class ApiRequestGenerate extends ApiRequest {

    /** Request a short, unique secret for sharing.
     *
     * @constructor
     * @augments ApiRequest
     */
    constructor(init: GenerateInit) {
        super(init);

        const body: GenerateBody = {};
        if (typeof init.passphrase !== "undefined") {
            body.passphrase = init.passphrase;
        }
        if (typeof init.ttl !== "undefined") {
            body.ttl = init.ttl;
        }
        if (typeof init.recipient !== "undefined") {
            body.recipient = init.recipient;
        }

        this.path = "generate";
        this.method = "POST";
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
     */
    constructor(init: RetrieveSecretInit) {
        super(init);

        const body: RetrieveSecretBody = {};
        if (typeof init.passphrase !== "undefined") {
            body.passphrase = init.passphrase;
        }

        this.path = ["secret", init.secretKey].join("/");
        this.method = "POST";
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

        this.path = ["private", init.metadataKey].join("/");
        this.method = "POST";
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

        this.path = ["private", init.metadataKey, "burn"].join("/");
        this.method = "POST";
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

        this.path = "private/recent";
        this.method = "GET";
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
