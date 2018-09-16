"use strict";

import ApiRequest, { url_encode_dict } from "./request";


class ApiRequestStatus extends ApiRequest {
    /* Check server status. */

    constructor(init) {
        super(init);

        this.PATH = "status";
        this.method = "GET";
    }

    _process(response) {
        /**
         * Process the api request.
         *
         * Parameter:
         * - response: response object received from the request
         *
         * Returns: true if server is available
         */

        console.debug(`${this.constructor.name} process`);

        let is_available = false;
        if (response.status === "nominal")
            is_available = true;

        return is_available;
    }
}

class ApiRequestShare extends ApiRequest {
    constructor(init) {
        /**
         * Send text to server for sharing.
         *
         * Additional init parameters:
         * - secret: secret to share
         * - passphrase: passphrase for secret (optional)
         * - ttl: time to live of secret (optional)
         * - recipient: optional recipient of secret (optional)
         *
         * Raises: if no secret was defined
         * */

        super(init);

        console.debug(`${this.constructor.name} secret=${init.secret}, passphrase=${init.passphrase}, ttl=${init.ttl}, recipient=${init.recipient}`);

        let body = {secret: init.secret};
        if (init.passphrase !== undefined) {
            body.passphrase = init.passphrase;
        }
        if (init.ttl !== undefined) {
            body.ttl = init.ttl;
        }
        if (init.recipient !== undefined) {
            body.recipient = init.recipient;
        }

        this.PATH = "share";
        this.method = "POST";
        this.body = url_encode_dict(body);
    }
}

class ApiRequestGenerate extends ApiRequest {
    constructor(init) {
        /** Request a short, unique secret for sharing.
         *
         * Additional init parameters:
         * - passphrase: passphrase for secret (optional)
         * - ttl: time to live of secret (optional)
         * - recipient: optional recipient of secret (optional)
         * */

        super(init);

        console.debug(`${this.constructor.name} passphrase=${init.passphrase}, ttl=${init.ttl}, recipient=${init.recipient}`);

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

        this.PATH = "generate";
        this.method = "POST";
        if (body) {
            this.body = url_encode_dict(body);
        }
    }
}

class ApiRequestRetrieveSecret extends ApiRequest {
    constructor(init) {
        /**
         * Retrieve a secret.
         *
         * Additional init parameters:
         * - secret_key: secret key of the secret to retrieve
         * - passphrase: passphrase for secret (optional)
         *
         * Raises: if no secret_key was defined
         * */

        super(init);

        console.debug(`${this.constructor.name} secret_key=${init.secret}, passphrase=${init.passphrase}`);

        this.PATH = ["secret", init.secret_key].join("/");
        this.method = "POST";
        if (init.passphrase !== undefined) {
            this.body = url_encode_dict({passphrase: init.passphrase});
        }
    }
}

class ApiRequestRetrieveMetadata extends ApiRequest {
    constructor(init) {
        /**
         * Retrieve metadata for a secret.
         *
         * Additional init parameters:
         * - metadata_key: secret key of the secret to retrieve
         *
         * Raises: if no metadata_key was defined
         */

        super(init);

        console.debug(`${this.constructor.name} metadata_key=${init.metadata_key}`);

        this.PATH = ["private", init.metadata_key].join("/");
        this.method = "POST";
    }
}

class ApiRequestBurn extends ApiRequest {
    constructor(init) {
        /**
         * Burn a secret.
         *
         * Additional init parameters:
         * - metadata_key: secret key of the secret to burn
         *
         * Raises: if no metadata_key was defined
         */

        super(init);

        console.debug(`${this.constructor.name} metadata_key=${init.metadata_key}`);

        this.PATH = ["secret", init.metadata_key, "burn"].join("/");
        this.method = "POST";
    }
}

class ApiRequestRecentMetadata extends ApiRequest {
    constructor(init) {
        /**
         * Fetch secret metadata from the server.
         */

        super(init);

        console.debug(`${this.constructor.name}`);

        this.PATH = "private/recent";
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
