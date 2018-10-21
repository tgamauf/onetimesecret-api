/**
 * Module provides functionality to provide API requests.
 */
"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var apiV1 = __importStar(require("./api_v1"));
var REQUEST_CONFIG = {
    burn: {
        v1: apiV1.ApiRequestBurn,
    },
    generate: {
        v1: apiV1.ApiRequestGenerate,
    },
    recentMetadata: {
        v1: apiV1.ApiRequestRecentMetadata,
    },
    retrieveMetadata: {
        v1: apiV1.ApiRequestRetrieveMetadata,
    },
    retrieveSecret: {
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