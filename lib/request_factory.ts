/**
 * Module provides functionality to provide API requests.
 */

"use strict";

import * as apiV1 from "./api_v1";
import {ApiRequest, ApiRequestInit} from "./request";


type RequestType = (
    "status" |
    "share" |
    "generate" |
    "retrieveSecret" |
    "retrieveMetadata" |
    "burn" |
    "recentMetadata");

type ApiVersion = "v1";

type ApiVersionEntries = {
    [key in ApiVersion]: typeof ApiRequest;
};

type RequestConfig = {
    [key in RequestType]: ApiVersionEntries;
};

const REQUEST_CONFIG: RequestConfig = {
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
function createApiRequest(
        requestType: RequestType,
        apiVersion: ApiVersion,
        init: ApiRequestInit): any {
    return new REQUEST_CONFIG[requestType][apiVersion](init);
}

export {
    RequestType,
    ApiVersion,
    createApiRequest
};
