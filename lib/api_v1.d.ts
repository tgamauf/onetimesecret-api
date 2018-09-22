/**
 * API version 1 implementation.
 */
import { ApiRequest, ApiRequestInit } from "./request";
interface StatusObject extends Object {
    status: string;
}
interface ShareInit extends ApiRequestInit {
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
interface RetrieveSecretInit extends ApiRequestInit {
    secretKey: string;
    passphrase?: string;
}
interface RetrieveMetadataInit extends ApiRequestInit {
    metadataKey: string;
}
interface BurnInit extends ApiRequestInit {
    metadataKey: string;
}
declare class ApiRequestStatus extends ApiRequest {
    /**
     * Check server status.
     *
     * @constructor
     * @augments ApiRequest
     */
    constructor(init: ApiRequestInit);
    /**
     * Convert server status to boolean.
     *
     * @param response object received from the request
     * @returns true if server is available
     */
    protected process(response: StatusObject): boolean;
}
declare class ApiRequestShare extends ApiRequest {
    /**
     * Send text to server for sharing.
     *
     * @constructor
     * @augments ApiRequest
     */
    constructor(init: ShareInit);
}
declare class ApiRequestGenerate extends ApiRequest {
    /** Request a short, unique secret for sharing.
     *
     * @constructor
     * @augments ApiRequest
     */
    constructor(init: GenerateInit);
}
declare class ApiRequestRetrieveSecret extends ApiRequest {
    /**
     * Retrieve a secret.
     *
     * @constructor
     * @augments ApiRequest
     */
    constructor(init: RetrieveSecretInit);
}
declare class ApiRequestRetrieveMetadata extends ApiRequest {
    /**
     * Retrieve metadata for a secret.
     *
     * @constructor
     * @augments ApiRequest
     */
    constructor(init: RetrieveMetadataInit);
}
declare class ApiRequestBurn extends ApiRequest {
    /**
     * Burn a secret.
     *
     * @constructor
     * @augments ApiRequest
     */
    constructor(init: BurnInit);
}
declare class ApiRequestRecentMetadata extends ApiRequest {
    /**
     * Fetch secret metadata from the server.
     *
     * @constructor
     * @augments ApiRequest
     */
    constructor(init: ApiRequestInit);
}
export { ApiRequestStatus, ApiRequestShare, ApiRequestGenerate, ApiRequestBurn, ApiRequestRetrieveSecret, ApiRequestRetrieveMetadata, ApiRequestRecentMetadata };
