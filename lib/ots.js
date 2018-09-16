"use strict";

import create_api_request from "./request_factory";


const DEFAULT_API_VERSION = "v1";
const DEFAULT_URL = "https://onetimesecret.com/";


class OneTimeSecretApi {
    constructor(username, api_key, options = null) {
        /**
         * Create object for interaction with OTS.
         *
         * Parameter:
         * - username: your OTS password
         * - api_key: the API key of your OTS account
         * - options: optional parameters
         * - api_version: API version to use; default: v1
         * - url: OTS server url; default: https://onetimesecret.com/
         */


        console.debug(`${this.constructor.name}`);

        this.init = {
            username: username,
            api_key: api_key,
        };

        if (options.url !== undefined) {
            this.init.url = options.url;
        } else {
            this.init.url = DEFAULT_URL;
        }

        if (options.api_version !== undefined) {
            this.api_version = options.api_version;
        } else {
            this.api_version = DEFAULT_API_VERSION;
        }
        // The api version is also required in the request
        this.init.api_version = this.api_version;
    }

    async status() {
        /**
         * Request the server status.
         *
         * Returns: promise that returns true if server is available
         *
         * Raises: connection/request errors
         */

        console.debug(`${this.constructor.name} status`);

        let request = create_api_request("status", this.api_version, this.init);

        return await request.send();
    }

    async share(secret, options = null) {
        /**
         * Share a secret.
         *
         * The response object is a dictionary that contains at least the
         * following keys:
         *   - metadata_key: private, unique key of the secret used for secret
         *       management
         *   - secret_key: unique key of the created secret, which is meant for
         *       sharing
         * Please check the API description for the other available keys:
         * https://onetimesecret.com/docs/api/secrets
         *
         * Parameter:
         * - secret: the secret value to encrypt and share (max. 1k-10k  length
         *       depending on your account)
         * - options: optional parameters
         *  - passphrase: string the recipent must know to view the secret;
         *      default: none
         *  - ttl: time after which the secret will be burned automatically;
         *      default: server default
         *  - recipient: email adress the secret will be sent to;
         *      default: none
         *
         * Returns: promise that returns response object
         *
         * Raises: connection/request errors
         */

        if (secret === undefined) {
            throw new Error("No secret defined");
        }

        let init = JSON.parse(JSON.stringify(this.init));

        init.secret = secret;

        if (options) {
            if (options.passphrase !== undefined) {
                init.passphrase = options.passphrase;
            }
            if (options.ttl !== undefined) {
                init.ttl = options.ttl;
            }
            if (options.recipient !== undefined) {
                init.recipient = options.recipient;
            }
        }

        console.debug(`${this.constructor.name} share init=${JSON.stringify(init)}`);

        let request = create_api_request("share", this.api_version, init);

        return await request.send();
    }

    _create_secret_url(secret_key) {
        /** Create the secret link from the secret. */

        return [this.init.url, "secret", secret_key].join("/");
    }

    async share_link(secret, options = null) {
        /**
         * Share a secret and get the link.
         *
         * Parameter:
         * - secret: the secret value to encrypt and share (max. 1k-10k  length
         *       depending on your account)
         * - options: optional parameters
         *   - passphrase: string the recipent must know to view the secret;
         *       default: none
         *   - ttl: time after which the secret will be burned automatically;
         *       default: server default
         *   - recipient: email adress the secret will be sent to; default: none
         *
         * Returns: promise that returns response object
         *
         * Raises: connection/request errors
         */

        console.debug(`${this.constructor.name} share_link`);

        let response = await this.share(secret, options);

        return this._create_secret_url(response.secret_key);
    }

    async generate(options) {
        /**
         * Generate a short, unique secret.
         *
         * The response object is a dictionary that contains at least the
         * following keys:
         * - metadata_key: private, unique key of the secret used for secret
         *     management
         * - secret_key: unique key of the created secret, which is meant for
         *     sharing
         * - value: generated secret
         * Please check the API description for the other available keys:
         * https://onetimesecret.com/docs/api/secrets
         *
         * Parameter:
         * - options: optional parameters
         *   - passphrase: string the recipent must know to view the secret;
         *       default: none
         *   - ttl: time after which the secret will be burned automatically;
         *       default: server default
         *   - recipient: email adress the secret will be sent to; default: none
         *
         * Raises: connection/request errors
         *
         * Returns: promise that returns response object
         */

        let init = JSON.parse(JSON.stringify(this.init));

        if (options) {
            if (options.passphrase !== undefined) {
                init.passphrase = options.passphrase;
            }
            if (options.ttl !== undefined) {
                init.ttl = options.ttl;
            }
            if (options.recipient !== undefined) {
                init.recipient = options.recipient;
            }
        }

        console.debug(`${this.constructor.name} generate init=${JSON.stringify(init)}`);

        let request = create_api_request("generate", this.api_version, init);

        return await request.send();
    }

    async retrieve_secret(secret_key, options=null) {
        /**
         * Retrieve the secret specified by the key.
         *
         * The response object is a dictionary that contains at least the
         * following keys:
         * - value: retrieved secret
         * Please check the API description for the other available keys:
         * https://onetimesecret.com/docs/api/secrets
         *
         * Parameter:
         * - secret_key: secret key of the secret
         * - options: optional parameters
         *   - passphrase: string the recipent must know to view the secret;
         *       default: none
         *
         * Raises: connection/request errors
         *
         * Returns: promise that returns response object
         */

        if (secret_key === undefined) {
            throw new Error("No secret key defined");
        }

        let init = JSON.parse(JSON.stringify(this.init));

        init.secret_key = secret_key;

        if (options && (options.passphrase !== undefined)) {
            init.passphrase = options.passphrase;
        }

        console.debug(`${this.constructor.name} retrieve_secret init=${JSON.stringify(init)}`);

        let request = create_api_request(
            "retrieve_secret",
            this.api_version,
            init);

        return await request.send();
    }

    async retrieve_metadata(metadata_key) {
        /**
         * Retrieve the metadata of the secret specified by the key.
         *
         * The response object is a dictionary that contains at least the
         * following keys:
         * - secret_key: unique key of the created secret, which is meant for
         *     sharing
         * - ttl: time the secret still has to live
         * - value: generated secret
         * Please check the API description for the other available keys:
         * https://onetimesecret.com/docs/api/secrets
         *
         * Parameter:
         * - metadata_key: private, unique key of the secret used for secret
         *      management
         *
         * Raises: connection/request errors
         *
         * Returns: promise that returns response object
         */

        if (metadata_key === undefined) {
            throw new Error("No metadata key defined");
        }

        console.debug(`${this.constructor.name} retrieve_metadata metadata_key=${metadata_key}`);

        let init = JSON.parse(JSON.stringify(this.init));

        init.metadata_key = metadata_key;

        let request = create_api_request(
            "retrieve_metadata",
            this.api_version,
            init);

        return await request.send();
    }

    async burn(metadata_key) {
        /**
         * Retrieve the metadata of the secret specified by the key.
         *
         * The response object is a dictionary that contains at least the
         * following keys:
         * - secret_key: unique key of the created secret, which is meant for
         *     sharing
         * - status: status of the secret set to "burned"
         * Please check the API description for the other available keys:
         * https://onetimesecret.com/docs/api/secrets
         *
         * Parameter:
         * - metadata_key: private, unique key of the secret used for secret
         *      management
         *
         * Raises: connection/request errors
         *
         * Returns: promise that returns response object
         */

        if (metadata_key === undefined) {
            throw new Error("No metadata key defined");
        }

        console.debug(`${this.constructor.name} burn metadata_key=${metadata_key}`);

        let init = JSON.parse(JSON.stringify(this.init));

        init.metadata_key = metadata_key;

        let request = create_api_request("burn", this.api_version, init);

        return await request.send();
    }

    async recent_metadata() {
        /**
         * Retrieve a list of recent metadata.
         *
         * The response object is a dictionary that contains at least the
         * following keys:
         * - metadata_key: private, unique key of the secret used for secret
         *     management
         * - secret_key: unique key of the created secret set to NULL
         * Please check the API description for the other available keys:
         * https://onetimesecret.com/docs/api/secrets
         *
         * Raises: connection/request errors
         *
         * Returns: promise that returns response object
         */

        console.debug(`${this.constructor.name} recent_metadata`);

        let request = create_api_request("recent", this.api_version, this.init);

        return await request.send();
    }
}


export default OneTimeSecretApi;
