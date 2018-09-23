/**
 * API implementation.
 */
import { ApiVersion } from "./request_factory";
interface ApiOptions {
    apiVersion?: ApiVersion;
    url?: string;
    port?: number;
}
declare type ApiResponseState = "new" | "received" | "burned" | "viewed";
interface ApiOptionsShare {
    passphrase?: string;
    ttl?: number;
    recipient?: string;
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
interface ApiResponseGenerate extends ApiResponseShare {
    value: string;
}
interface ApiOptionsRetrieveSecret {
    passphrase?: string;
}
interface ApiResponseRetrieveSecret {
    value: string;
    secret_key: string;
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
interface ApiResponseBurn {
    "state": {
        custid: string;
        metadata_key: string;
        secret_key: string;
        ttl: number;
        metadata_ttl: number;
        secret_ttl: number;
        state: "burned";
        updated: number;
        created: number;
        recipient: string[];
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
declare class ConfigError extends Error {
    constructor(message: string);
}
declare class OneTimeSecretApi {
    private readonly init;
    private readonly apiVersion;
    /**
     * Create object for interaction with OTS.
     *
     * @param username  OTS password
     * @param password API key of OTS account
     * @param options optional parameters
     */
    constructor(username: string, password: string, options?: ApiOptions);
    /**
     * Request the server status.
     *
     * @returns promise that returns true if server is available
     * @throws error if connection/request fails
     */
    status(): Promise<boolean>;
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
    share(secret: string, options?: ApiOptionsShare): Promise<ApiResponseShare>;
    /**
     * Share a secret and get the link.
     *
     * @deprecated will be removed in next major version
     * @param secret the secret value to encrypt and share (max. 1k-10k length
     *      depending on your account)
     * @param options optional parameters
     * @returns promise that returns response object
     * @throws error if no secret defined or connection/request fails
     */
    shareLink(secret: string, options?: ApiOptionsShare): Promise<string>;
    /**
     * Generate a short, unique secret.
     * Please check the API description for the other available keys:
     * https://onetimesecret.com/docs/api/secrets
     *
     * @param options optional parameters
     * @returns that returns response object
     * @throws error if connection/request fails
     */
    generate(options?: ApiOptionsShare): Promise<ApiResponseGenerate>;
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
    retrieveSecret(secretKey: string, options?: ApiOptionsRetrieveSecret): Promise<ApiResponseRetrieveSecret>;
    /**
     * Retrieve the secret specified by the key.
     * Please check the API description for the other available keys:
     * https://onetimesecret.com/docs/api/secrets
     *
     * @deprecated replaced by retrieveSecret
     * @param secretKey secret key of the secret
     * @param options optional parameters
     * @returns that returns response object
     * @throws error if no secret key defined or connection/request fails
     */
    retrieve_secret(secretKey: string, options?: ApiOptionsRetrieveSecret): Promise<ApiResponseRetrieveSecret>;
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
    retrieveMetadata(metadataKey: string): Promise<ApiResponseRetrieveMetadata>;
    /**
     * Retrieve the metadata of the secret specified by the key.
     * Please check the API description for the other available keys:
     * https://onetimesecret.com/docs/api/secrets
     *
     * @deprecated replaced by retrieveMetadata
     * @param metadataKey: private, unique key of the secret used for secret
     *      management
     * @returns promise that returns response object
     * @throws error if no metadata key defined or connection/request fails
     */
    retrieve_metadata(metadataKey: string): Promise<ApiResponseRetrieveMetadata>;
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
    burn(metadataKey: string): Promise<ApiResponseBurn>;
    /**
     * Retrieve a list of recent metadata.
     * Please check the API description for the other available keys:
     * https://onetimesecret.com/docs/api/secrets
     *
     * @returns promise that returns response object
     * @throws error if connection/request fails
     */
    recentMetadata(): Promise<ApiResponseRecentMetadata[]>;
    /**
     * Retrieve a list of recent metadata.
     * Please check the API description for the other available keys:
     * https://onetimesecret.com/docs/api/secrets
     *
     * @deprecated
     * @returns promise that returns response object
     * @throws error if connection/request fails
     */
    recent_metadata(): Promise<ApiResponseRecentMetadata[]>;
    /** Create the secret link from the secret. */
    private createSecretUrl;
}
export { ConfigError, ApiVersion, ApiResponseState, ApiOptionsShare, ApiResponseShare, ApiOptionsGenerate, ApiResponseGenerate, ApiOptionsRetrieveSecret, ApiResponseRetrieveSecret, ApiResponseRetrieveMetadata, ApiResponseBurn, ApiResponseRecentMetadata, OneTimeSecretApi };
