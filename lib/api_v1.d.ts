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
declare class ApiRequestV1 extends ApiRequest {
    protected readonly keyRegex: RegExp;
}
declare class ApiRequestStatus extends ApiRequestV1 {
    /**
     * Check server status.
     *
     * @constructor
     * @augments ApiRequestV1
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
declare class ApiRequestShare extends ApiRequestV1 {
    /**
     * Send text to server for sharing.
     *
     * @constructor
     * @augments ApiRequestV1
     */
    constructor(init: ShareInit);
}
declare class ApiRequestGenerate extends ApiRequestV1 {
    /** Request a short, unique secret for sharing.
     *
     * @constructor
     * @augments ApiRequestV1
     */
    constructor(init: GenerateInit);
}
declare class ApiRequestRetrieveSecret extends ApiRequestV1 {
    /**
     * Retrieve a secret.
     *
     * @constructor
     * @augments ApiRequestV1
     */
    constructor(init: RetrieveSecretInit);
}
declare class ApiRequestRetrieveMetadata extends ApiRequestV1 {
    /**
     * Retrieve metadata for a secret.
     *
     * @constructor
     * @augments ApiRequestV1
     */
    constructor(init: RetrieveMetadataInit);
}
declare class ApiRequestBurn extends ApiRequestV1 {
    /**
     * Burn a secret.
     *
     * @constructor
     * @augments ApiRequestV1
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
