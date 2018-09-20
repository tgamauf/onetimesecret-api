/**
 * API implementation.
 */


'use strict';

import {ApiRequest} from "./request";
import {ApiVersion, createApiRequest} from "./request_factory";


interface ApiInit {
    username: string,
    password: string,
    apiVersion: ApiVersion,
    url: string,
    port?: number
}

interface ApiOptions {
    apiVersion?: ApiVersion
    url?: string,
    port?: number,
}

interface ApiDefaultOptions {
    apiVersion: ApiVersion
    url: string,
    port?: number,
}

type ApiResponseState = 'new' | 'received' | 'burned' | 'viewed';

interface ApiOptionsShare {
    passphrase?: string,
    ttl?: number,
    recipient?: string
}

interface ApiInitShare extends ApiInit, ApiOptionsShare {
    secret: string
}

interface ApiResponseShare {
    custid: string,
    metadata_key: string,
    secret_key: string,
    ttl: number,
    metadata_ttl: number,
    secret_ttl: number,
    state: ApiResponseState,
    updated: number,
    created: number,
    recipient: string[],
    passphrase_required: boolean
}

interface ApiOptionsGenerate extends ApiOptionsShare {
}

interface ApiInitGenerate extends ApiInit, ApiOptionsGenerate {
}

interface ApiResponseGenerate extends ApiResponseShare {
    value: string
}

interface ApiOptionsRetrieveSecret {
    passphrase?: string,
}

interface ApiInitRetrieveSecret extends ApiInit, ApiOptionsRetrieveSecret {
    secret_key: string
}

interface ApiResponseRetrieveSecret {
    value: string,
    secret_key: string
}

interface ApiInitRetrieveMetadata extends ApiInit {
    metadata_key: string
}

interface ApiResponseRetrieveMetadata {
    custid: string,
    metadata_key: string,
    ttl: number,
    metadata_ttl: number,
    state: ApiResponseState,
    updated: number,
    created: number,
    recipient: string[],
    secret_key?: string,
    secret_ttl?: number,
    received?: number,
    passphrase_required?: boolean
}

interface ApiInitBurn extends ApiInit {
    metadata_key: string
}

interface ApiResponseBurn {
    "state": {
        custid: string,
        metadata_key: string,
        secret_key: string,
        ttl: number,
        metadata_ttl: number,
        secret_ttl: number,
        state: 'burned',
        updated: number,
        created: number,
        recipient: string[]
    },
    "secret_shortkey": string
}

interface ApiResponseRecentMetadata {
    custid: string,
    metadata_key: string,
    ttl: number,
    metadata_ttl: number,
    secret_ttl: number,
    state: ApiResponseState,
    updated: number,
    created: number,
    recipient: string[],
    received?: number
}

const DEFAULT_URL: string = 'https://onetimesecret.com';
const DEFAULT_API_VERSION: ApiVersion = 'v1';


class OneTimeSecretApi {
    init: ApiInit;
    apiVersion: ApiVersion;

    /**
     * Create object for interaction with OTS.
     *
     * @param username  OTS password
     * @param password API key of OTS account
     * @param options optional parameters
     */
    public constructor(username: string,
                       password: string,
                       options?: ApiOptions) {
        const defaultOptions: ApiDefaultOptions = {
            url: DEFAULT_URL,
            apiVersion: DEFAULT_API_VERSION
        };

        this.init = {
            username: username,
            password: password,
            ...defaultOptions,
            ...options
        };

        // The api version is also required in the request
        this.apiVersion = this.init.apiVersion;
    }

    private createSecretUrl(secret_key: string): string {
        /** Create the secret link from the secret. */

        return [this.init.url, 'secret', secret_key].join('/');
    }

    /**
     * Request the server status.
     *
     * @returns promise that returns true if server is available
     * @throws error if connection/request fails
     */
    public async status(): Promise<boolean> {
        const request: ApiRequest = createApiRequest(
            'status',
            this.apiVersion,
            this.init);

        return await request.send();
    }

    /**
     * Share a secret.
     * Please check the API description for the other available keys:
     * https://onetimesecret.com/docs/api/secrets
     *
     * @param secret the secret value to encrypt and share (max. 1k-10k length
     *      depending on your account)
     * @param options optional parameters
     * @returns promise that returns response object
     * @throws error if no secret defined or connection/request fails
     */
    public async share(secret: string,
                       options?: ApiOptionsShare): Promise<ApiResponseShare> {
        const init: ApiInitShare = {
            ...JSON.parse(JSON.stringify(this.init)),
            secret: secret,
            ...options
        };

        const request: ApiRequest = createApiRequest(
            'share',
            this.apiVersion,
            init);

        return await request.send();
    }

    /**
     * Share a secret and get the link.
     *
     * @param secret the secret value to encrypt and share (max. 1k-10k length
     *      depending on your account)
     * @param options optional parameters
     * @returns promise that returns response object
     * @throws error if no secret defined or connection/request fails
     */
    async shareLink(secret: string, options?: ApiOptionsShare): Promise<string> {
        const response: ApiResponseShare = await this.share(secret, options);

        return this.createSecretUrl(response.secret_key);
    }

    /**
     * Generate a short, unique secret.
     * Please check the API description for the other available keys:
     * https://onetimesecret.com/docs/api/secrets
     *
     * @param options optional parameters
     * @returns that returns response object
     * @throws error if connection/request fails
     */
    async generate(options?: ApiOptionsShare): Promise<ApiResponseGenerate> {
        const init: ApiInitGenerate = {
            ...JSON.parse(JSON.stringify(this.init)),
            ...options
        };

        const request: ApiRequest = createApiRequest(
            'generate',
            this.apiVersion,
            init);

        return await request.send();
    }

    /**
     * Retrieve the secret specified by the key.
     * Please check the API description for the other available keys:
     * https://onetimesecret.com/docs/api/secrets
     *
     * @param secret_key secret key of the secret
     * @param options optional parameters
     * @returns that returns response object
     * @throws error if no secret key defined or connection/request fails
     */
    async retrieve_secret(
            secret_key: string,
            options?: ApiOptionsRetrieveSecret): Promise<ApiResponseRetrieveSecret> {
        const init: ApiInitRetrieveSecret = {
            ...JSON.parse(JSON.stringify(this.init)),
            secret_key: secret_key,
            ...options
        };

        const request: ApiRequest = createApiRequest(
            'retrieve_secret',
            this.apiVersion,
            init);

        return await request.send();
    }

    /**
     * Retrieve the metadata of the secret specified by the key.
     * Please check the API description for the other available keys:
     * https://onetimesecret.com/docs/api/secrets
     *
     * @param metadata_key: private, unique key of the secret used for secret
     *      management
     * @returns promise that returns response object
     * @throws error if no metadata key defined or connection/request fails
     */
    async retrieve_metadata(
        metadata_key: string): Promise<ApiResponseRetrieveMetadata> {
        const init: ApiInitRetrieveMetadata = {
            ...JSON.parse(JSON.stringify(this.init)),
            metadata_key: metadata_key
        };

        const request: ApiRequest = createApiRequest(
            'retrieve_metadata',
            this.apiVersion,
            init);

        return await request.send();
    }

    /**
     * Retrieve the metadata of the secret specified by the key.
     * Please check the API description for the other available keys:
     * https://onetimesecret.com/docs/api/secrets
     *
     * @param metadata_key private, unique key of the secret used for secret
     *      management
     * @returns promise that returns response object
     * @throws error if no metadata key defined or connection/request fails
     */
    async burn(metadata_key: string): Promise<ApiResponseBurn> {
        const init: ApiInitBurn = {
            ...JSON.parse(JSON.stringify(this.init)),
            metadata_key: metadata_key
        };

        const request: ApiRequest = createApiRequest(
            'burn',
            this.apiVersion,
            init);

        return await request.send();
    }

    /**
     * Retrieve a list of recent metadata.
     * Please check the API description for the other available keys:
     * https://onetimesecret.com/docs/api/secrets
     *
     * @returns promise that returns response object
     * @throws error if connection/request fails
     */
    async recent_metadata(): Promise<ApiResponseRecentMetadata[]> {
        const request: ApiRequest = createApiRequest(
            'recent_metadata',
            this.apiVersion,
            this.init);

        return await request.send();
    }
}

export {
    ApiVersion,
    ApiResponseState,
    ApiOptionsShare,
    ApiResponseShare,
    ApiOptionsGenerate,
    ApiResponseGenerate,
    ApiOptionsRetrieveSecret,
    ApiResponseRetrieveSecret,
    ApiResponseRetrieveMetadata,
    ApiResponseBurn,
    ApiResponseRecentMetadata,
    OneTimeSecretApi
};
