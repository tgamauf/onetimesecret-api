"use strict";

import * as ApiV1 from "./api_v1";

const API_VERSIONS = ["v1"];


const RequestConfig = {
    status: {
        v1: ApiV1.ApiRequestStatus
    },
    share: {
        v1: ApiV1.ApiRequestShare
    },
    generate: {
        v1: ApiV1.ApiRequestGenerate
    },
    retrieve_secret: {
        v1: ApiV1.ApiRequestRetrieveSecret
    },
    retrieve_metadata: {
        v1: ApiV1.ApiRequestRetrieveMetadata
    },
    burn: {
        v1: ApiV1.ApiRequestBurn
    },
    recent: {
        v1: ApiV1.ApiRequestRecentMetadata
    }
};

function create_api_request(request_type, api_version, init) {
    /**
     * Create an API request object of given type using the given init parameter
     * for the provided API version, if provided.
     *
     * Parameter:
     * - request_type: type of request as string. Must be one of
     *      - "status"
     *      - "share"
     *      - "generate"
     *      - "retrieve_secret"
     *      - "retrieve_metadata"
     *      - "burn"
     *      - "recent"
     * - api_version: api version to use
     * - init: initialization parameters
     *      - username: username of the user
     *      - api_key: api key of the user
     *      - url: server url
     *      - api_version: api version to use
     *
     * Returns: an ApiRequest request object of specified type
     *
     * Raises: if invalid request_type or api_version was provided
     */

    let request_config = RequestConfig[request_type];
    if (request_config === undefined) {
        throw Error(`OTS API doesn't provide request of type ${request_type}`);
    }

    api_version = api_version.toLowerCase();
    if (API_VERSIONS.indexOf(api_version) === -1) {
        throw Error(`OTS API version '${api_version}' not implemented`);
    }

    return new request_config[api_version](init);
}

export default create_api_request;
