/**
 * API implementation.
 */

"use strict";

import {ApiRequest, InputError} from "./request";
import {ApiVersion, createApiRequest} from "./request_factory";


// setPrototypeOf polyfill for React Native Android
Object.setPrototypeOf =
    Object.setPrototypeOf ||
    function (obj, proto) {
        obj.__proto__ = proto;
        return obj;
    };


interface ApiInit {
    username: string;
    password: string;
    apiVersion: ApiVersion;
    url: string;
    port?: number;
}

interface ApiOptions {
    apiVersion?: ApiVersion;
    url?: string;
    port?: number;
}

interface ApiDefaultOptions {
    apiVersion: ApiVersion;
    url: string;
    port?: number;
}

type ApiResponseState = "new" | "received" | "burned" | "viewed";

interface ApiOptionsShare {
    passphrase?: string;
    ttl?: number;
    recipient?: string;
}

interface ApiInitShare extends ApiInit, ApiOptionsShare {
    secret: string;
}

interface ApiResponseShare {
    custid: string;
    metadata_key: string;
    secret_key: string;
    share_link: string;
    ttl: number;
    metadata_ttl: number;
    secret_ttl: number;
    state: ApiResponseState;
    updated: number;
    created: number;
    recipient: string[];
    passphrase_required: boolean;
}

interface ApiOptionsGenerate extends ApiOptionsShare {
}

interface ApiInitGenerate extends ApiInit, ApiOptionsGenerate {
}

interface ApiResponseGenerate extends ApiResponseShare {
    value: string;
}

interface ApiOptionsRetrieveSecret {
    passphrase?: string;
}

interface ApiInitRetrieveSecret extends ApiInit, ApiOptionsRetrieveSecret {
    secretKey: string;
}

interface ApiResponseRetrieveSecret {
    value: string;
    secret_key: string;
}

interface ApiInitRetrieveMetadata extends ApiInit {
    metadataKey: string;
}

interface ApiResponseRetrieveMetadata {
    custid: string;
    metadata_key: string;
    ttl: number;
    metadata_ttl: number;
    state: ApiResponseState;
    updated: number;
    created: number;
    recipient: string[];
    secret_key?: string;
    share_link?: string;
    secret_ttl?: number;
    received?: number;
    passphrase_required?: boolean;
}

interface ApiInitBurn extends ApiInit {
    metadata_key: string;
}

interface ApiResponseBurn {
    "state": {
        custid: string,
        metadata_key: string,
        secret_key: string,
        ttl: number,
        metadata_ttl: number,
        secret_ttl: number,
        state: "burned",
        updated: number,
        created: number,
        recipient: string[],
    };
    "secret_shortkey": string;
}

interface ApiResponseRecentMetadata {
    custid: string;
    metadata_key: string;
    ttl: number;
    metadata_ttl: number;
    secret_ttl: number;
    state: ApiResponseState;
    updated: number;
    created: number;
    recipient: string[];
    received?: number;
}

const DEFAULT_URL: string = "https://onetimesecret.com";
const DEFAULT_API_VERSION: ApiVersion = "v1";


class OneTimeSecretApi {
    private readonly init: ApiInit;
    private readonly apiVersion: ApiVersion;

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
            apiVersion: DEFAULT_API_VERSION,
            url: DEFAULT_URL,
        };

        if ((typeof username === "undefined")
            || (typeof password === "undefined")) {
            throw new InputError("No username or password provided");
        }

        this.init = {
            username,
            password,
            ...defaultOptions,
            ...options,
        };

        // The api version is also required in the request
        this.apiVersion = this.init.apiVersion;
    }

    /**
     * Request the server status.
     *
     * @returns promise that returns true if server is available
     * @throws error if connection/request fails
     */
    public async status(): Promise<boolean> {
        const request: ApiRequest = createApiRequest(
            "status",
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
        if (typeof secret === "undefined") {
            throw new InputError("No secret provided");
        }

        const init: ApiInitShare = {
            ...JSON.parse(JSON.stringify(this.init)),
            secret,
            ...options,
        };

        const request: ApiRequest = createApiRequest(
            "share",
            this.apiVersion,
            init);

        const response = await request.send();

        const shareLink: string = this.createSecretUrl(
            response.secret_key);

        return {
            share_link: shareLink,
            ...response,
        };
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
    public async generate(options?: ApiOptionsShare): Promise<ApiResponseGenerate> {
        const init: ApiInitGenerate = {
            ...JSON.parse(JSON.stringify(this.init)),
            ...options,
        };

        const request: ApiRequest = createApiRequest(
            "generate",
            this.apiVersion,
            init);

        const response = await request.send();

        const shareLink: string = this.createSecretUrl(
            response.secret_key);

        return {
            share_link: shareLink,
            ...response,
        };
    }

    /**
     * Retrieve the secret specified by the key.
     * Please check the API description for the other available keys:
     * https://onetimesecret.com/docs/api/secrets
     *
     * @param secretKey secret key of the secret
     * @param options optional parameters
     * @returns that returns response object
     * @throws error if no secret key defined or connection/request fails
     */
    public async retrieveSecret(
        secretKey: string,
        options?: ApiOptionsRetrieveSecret): Promise<ApiResponseRetrieveSecret> {
        const init: ApiInitRetrieveSecret = {
            ...JSON.parse(JSON.stringify(this.init)),
            secretKey,
            ...options,
        };

        const request: ApiRequest = createApiRequest(
            "retrieveSecret",
            this.apiVersion,
            init);

        return await request.send();
    }

    /**
     * Retrieve the metadata of the secret specified by the key.
     * Please check the API description for the other available keys:
     * https://onetimesecret.com/docs/api/secrets
     *
     * @param metadataKey: private, unique key of the secret used for secret
     *      management
     * @returns promise that returns response object
     * @throws error if no metadata key defined or connection/request fails
     */
    public async retrieveMetadata(
        metadataKey: string): Promise<ApiResponseRetrieveMetadata> {
        const init: ApiInitRetrieveMetadata = {
            ...JSON.parse(JSON.stringify(this.init)),
            metadataKey,
        };

        const request: ApiRequest = createApiRequest(
            "retrieveMetadata",
            this.apiVersion,
            init);

        const response = await request.send();

        if (typeof response.secret_key === "undefined") {
            return response;
        } else {
            const shareLink: string = this.createSecretUrl(
                response.secret_key);

            return {
                share_link: shareLink,
                ...response,
            };
        }
    }

    /**
     * Retrieve the metadata of the secret specified by the key.
     * Please check the API description for the other available keys:
     * https://onetimesecret.com/docs/api/secrets
     *
     * @param metadataKey private, unique key of the secret used for secret
     *      management
     * @returns promise that returns response object
     * @throws error if no metadata key defined or connection/request fails
     */
    public async burn(metadataKey: string): Promise<ApiResponseBurn> {
        const init: ApiInitBurn = {
            ...JSON.parse(JSON.stringify(this.init)),
            metadataKey,
        };

        const request: ApiRequest = createApiRequest(
            "burn",
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
    public async recentMetadata(): Promise<ApiResponseRecentMetadata[]> {
        const request: ApiRequest = createApiRequest(
            "recentMetadata",
            this.apiVersion,
            this.init);

        return await request.send();
    }

    /** Create the secret link from the secret. */
    private createSecretUrl(secretKey: string): string {

        return [this.init.url, "secret", secretKey].join("/");
    }
}

export {
    InputError,
    OneTimeSecretApi
};
export type {
    ApiOptions,
    ApiResponseBurn,
    ApiOptionsGenerate,
    ApiOptionsRetrieveSecret,
    ApiOptionsShare,
    ApiResponseGenerate,
    ApiResponseRecentMetadata,
    ApiResponseRetrieveMetadata,
    ApiResponseRetrieveSecret,
    ApiResponseShare,
    ApiResponseState,
    ApiVersion,
}