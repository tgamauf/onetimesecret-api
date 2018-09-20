/**
 * Module provides functionality to provide API requests.
 */


'use strict';

import * as apiV1 from './api_v1';
import {ApiRequest, ApiRequestInit} from "./request";


type RequestType = (
    'status' |
    'share' |
    'generate' |
    'retrieve_secret' |
    'retrieve_metadata' |
    'burn' |
    'recent_metadata');

type ApiVersion = 'v1';

// TODO remove if not used
type ApiVersionEntries = {
    [key in ApiVersion]: ApiRequest;
};
type RequestConfig = {
    [key in RequestType]: ApiVersionEntries;
}

const API_VERSIONS: string[] = [ 'v1' ];

// TODO this should be of type RequestConfig, but it complains about derived classes not having path
const REQUEST_CONFIG: object = {
    status: {
        v1: apiV1.ApiRequestStatus
    },
    share: {
        v1: apiV1.ApiRequestShare
    },
    generate: {
        v1: apiV1.ApiRequestGenerate
    },
    retrieve_secret: {
        v1: apiV1.ApiRequestRetrieveSecret
    },
    retrieve_metadata: {
        v1: apiV1.ApiRequestRetrieveMetadata
    },
    burn: {
        v1: apiV1.ApiRequestBurn
    },
    recent_metadata: {
        v1: apiV1.ApiRequestRecentMetadata
    }
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
