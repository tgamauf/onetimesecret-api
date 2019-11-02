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

class ApiRequestV1 extends ApiRequest {
    protected readonly keyRegex: RegExp = new RegExp("^[A-Za-z0-9]{31}$");
}

class ApiRequestStatus extends ApiRequestV1 {

    /**
     * Check server status.
     *
     * @constructor
     * @augments ApiRequestV1
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

class ApiRequestShare extends ApiRequestV1 {

    /**
     * Send text to server for sharing.
     *
     * @constructor
     * @augments ApiRequestV1
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

class ApiRequestGenerate extends ApiRequestV1 {

    /** Request a short, unique secret for sharing.
     *
     * @constructor
     * @augments ApiRequestV1
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

class ApiRequestRetrieveSecret extends ApiRequestV1 {

    /**
     * Retrieve a secret.
     *
     * @constructor
     * @augments ApiRequestV1
     */
    constructor(init: RetrieveSecretInit) {
        super(init);

        this.checkValidKey(init.secretKey);

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

class ApiRequestRetrieveMetadata extends ApiRequestV1 {

    /**
     * Retrieve metadata for a secret.
     *
     * @constructor
     * @augments ApiRequestV1
     */
    constructor(init: RetrieveMetadataInit) {
        super(init);

        this.checkValidKey(init.metadataKey);

        this.path = ["private", init.metadataKey].join("/");
        this.method = "POST";
    }
}

class ApiRequestBurn extends ApiRequestV1 {

    /**
     * Burn a secret.
     *
     * @constructor
     * @augments ApiRequestV1
     */
    constructor(init: BurnInit) {
        super(init);

        this.checkValidKey(init.metadataKey);

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
