/**
 * API implementation.
 */

'use strict';

const createApiRequest = require('./request_factory.js');


const DEFAULT_API_VERSION = 'v1';
const DEFAULT_URL = 'https://onetimesecret.com';


class OneTimeSecretApi {

    /**
     * Create object for interaction with OTS.
     *
     * @param {String} username  OTS password
     * @param {String} apiKey API key of OTS account
     * @param {Object} options optional parameters
     *  - apiVersion: API version to use; default: v1
     *  - url: OTS server url; default: https://onetimesecret.com/
     */
    constructor(username, apiKey, options=null) {
        this.init = {
            username: username,
            apiKey: apiKey,
        };

        if (options && options.url !== undefined) {
            this.init.url = options.url.replace(/\/+$/, "");;
        } else {
            this.init.url = DEFAULT_URL;
        }

        if (options && options.apiVersion !== undefined) {
            this.apiVersion = options.apiVersion;
        } else {
            this.apiVersion = DEFAULT_API_VERSION;
        }
        // The api version is also required in the request
        this.init.apiVersion = this.apiVersion;
    }

    /**
     * Request the server status.
     *
     * @returns {Promise} that returns true if server is available
     * @throws error if connection/request fails
     */
    async status() {
        let request = createApiRequest('status', this.apiVersion, this.init);

        return await request.send();
    }

    /**
     * Share a secret.
     * The response object is a dictionary that contains at least the
     * following keys:
     *   - metadata_key: private, unique key of the secret used for secret
     *       management
     *   - secret_key: unique key of the created secret, which is meant for
     *       sharing
     * Please check the API description for the other available keys:
     * https://onetimesecret.com/docs/api/secrets
     *
     * @param {String} secret the secret value to encrypt and share (max. 1k-10k
     *      length depending on your account)
     * @param {Object} options optional parameters
     *  - passphrase: string the recipent must know to view the secret;
     *      default: none
     *  - ttl: time after which the secret will be burned automatically;
     *      default: server default
     *  - recipient: email adress the secret will be sent to;
     *      default: none
     * @returns {Promise} that returns response object
     * @throws error if no secret defined or connection/request fails
     */
    async share(secret, options=null) {

        if (secret === undefined) {
            throw new Error('No secret defined');
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

        let request = createApiRequest('share', this.apiVersion, init);

        return await request.send();
    }

    _createSecretUrl(secret_key) {
        /** Create the secret link from the secret. */

        return [this.init.url, 'secret', secret_key].join('/');
    }

    /**
     * Share a secret and get the link.
     * @param {String} secret the secret value to encrypt and share (max. 1k-10k
     *      length depending on your account)
     * @param {Object} options optional parameters
     *  - passphrase: string the recipent must know to view the secret;
     *      default: none
     *  - ttl: time after which the secret will be burned automatically;
     *      default: server default
     *  - recipient: email adress the secret will be sent to;
     *      default: none
     * @returns {Promise} that returns response object
     * @throws error if no secret defined or connection/request fails
     */
    async shareLink(secret, options=null) {
        let response = await this.share(secret, options);

        return this._createSecretUrl(response.secret_key);
    }

    /**
     * Generate a short, unique secret.
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
     * @param {Object} options optional parameters
     *   - passphrase: string the recipent must know to view the secret;
     *       default: none
     *   - ttl: time after which the secret will be burned automatically;
     *       default: server default
     *   - recipient: email adress the secret will be sent to; default: none
     * @returns {Promise} that returns response object
     * @throws error if connection/request fails
     */
    async generate(options) {
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

        let request = createApiRequest('generate', this.apiVersion, init);

        return await request.send();
    }

    /**
     * Retrieve the secret specified by the key.
     * The response object is a dictionary that contains at least the
     * following keys:
     * - value: retrieved secret
     * Please check the API description for the other available keys:
     * https://onetimesecret.com/docs/api/secrets
     *
     * @param {String} secret_key secret key of the secret
     * @param {String} options optional parameters
     *   - passphrase: string the recipent must know to view the secret;
     *       default: none
     * @returns {Promise} that returns response object
     * @throws error if no secret key defined or connection/request fails
     */
    async retrieve_secret(secret_key, options=null) {

        if (secret_key === undefined) {
            throw new Error('No secret key defined');
        }

        let init = JSON.parse(JSON.stringify(this.init));
        init.secret_key = secret_key;

        if (options && (options.passphrase !== undefined)) {
            init.passphrase = options.passphrase;
        }

        let request = createApiRequest(
            'retrieve_secret',
            this.apiVersion,
            init);

        return await request.send();
    }

    /**
     * Retrieve the metadata of the secret specified by the key.
     * The response object is a dictionary that contains at least the
     * following keys:
     * - secret_key: unique key of the created secret, which is meant for
     *     sharing
     * - ttl: time the secret still has to live
     * - value: generated secret
     * Please check the API description for the other available keys:
     * https://onetimesecret.com/docs/api/secrets
     *
     * @param {String} metadata_key: private, unique key of the secret used for
     *      secret management
     * @returns {Promise} that returns response object
     * @throws error if no metadata key defined or connection/request fails
     */
    async retrieve_metadata(metadata_key) {
        if (metadata_key === undefined) {
            throw new Error('No metadata key defined');
        }

        let init = JSON.parse(JSON.stringify(this.init));
        init.metadata_key = metadata_key;

        let request = createApiRequest(
            'retrieve_metadata',
            this.apiVersion,
            init);

        return await request.send();
    }

    /**
     * Retrieve the metadata of the secret specified by the key.
     * The response object is a dictionary that contains at least the
     * following keys:
     * - secret_key: unique key of the created secret, which is meant for
     *     sharing
     * - status: status of the secret set to 'burned'
     * Please check the API description for the other available keys:
     * https://onetimesecret.com/docs/api/secrets
     *
     * @param {String} metadata_key private, unique key of the secret used for
     *      secret management
     * @returns {Promise} that returns response object
     * @throws error if no metadata key defined or connection/request fails
     */
    async burn(metadata_key) {
        if (metadata_key === undefined) {
            throw new Error('No metadata key defined');
        }

        let init = JSON.parse(JSON.stringify(this.init));
        init.metadata_key = metadata_key;

        let request = createApiRequest('burn', this.apiVersion, init);

        return await request.send();
    }

    /**
     * Retrieve a list of recent metadata.
     * The response object is a dictionary that contains at least the
     * following keys:
     * - metadata_key: private, unique key of the secret used for secret
     *     management
     * - secret_key: unique key of the created secret set to NULL
     * Please check the API description for the other available keys:
     * https://onetimesecret.com/docs/api/secrets
     *
     * @returns {Promise} that returns response object
     * @throws error if connection/request fails
     */
    async recent_metadata() {
        let request = createApiRequest('recent', this.apiVersion, this.init);

        return await request.send();
    }
}


module.exports = exports = OneTimeSecretApi;