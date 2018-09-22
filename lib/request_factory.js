/**
 * Module provides functionality to provide API requests.
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var apiV1 = require("./api_v1");
var REQUEST_CONFIG = {
    burn: {
        v1: apiV1.ApiRequestBurn,
    },
    generate: {
        v1: apiV1.ApiRequestGenerate,
    },
    recent_metadata: {
        v1: apiV1.ApiRequestRecentMetadata,
    },
    retrieve_metadata: {
        v1: apiV1.ApiRequestRetrieveMetadata,
    },
    retrieve_secret: {
        v1: apiV1.ApiRequestRetrieveSecret,
    },
    share: {
        v1: apiV1.ApiRequestShare,
    },
    status: {
        v1: apiV1.ApiRequestStatus,
    },
};
/**
 * Create an API request object of given type using the given init parameter
 * for the provided API version, if provided.
 *
 * @constructor
 * @param requestType type of request
 * @param apiVersion api version to use
 * @param init initialization parameters
 *
 * @returns request object of specified type
 */
function createApiRequest(requestType, apiVersion, init) {
    return new REQUEST_CONFIG[requestType][apiVersion](init);
}
exports.createApiRequest = createApiRequest;
//# sourceMappingURL=request_factory.js.map