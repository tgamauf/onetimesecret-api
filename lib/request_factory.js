/**
 * Module provides functionality to provide API requests.
 */

'use strict';

const apiV1 = require('./api_v1.js');

const API_VERSIONS = ['v1'];


const REQUEST_CONFIG = {
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
    recent: {
        v1: apiV1.ApiRequestRecentMetadata
    }
};

/**
 * Create an API request object of given type using the given init parameter
 * for the provided API version, if provided.
 *
 * @constructor
 * @param {string} requestType type of request. Must be one of
 *  - "status"
 *  - "share"
 *  - "generate"
 *  - "retrieve_secret"
 *  - "retrieve_metadata"
 *  - "burn"
 *  - "recent"
 * @param {string} apiVersion api version to use
 * @param {object} init initialization parameters
 *  - username: username of the user
 *  - apiKey: api key of the user
 *  - url: server url
 *  - apiVersion: api version to use
 *
 * @returns {ApiRequest} request object of specified type
 *
 * Raises: if invalid requestType or apiVersion was provided
 */
function createApiRequest(requestType, apiVersion, init) {
    let requestConfig = REQUEST_CONFIG[requestType];
    if (requestConfig === undefined) {
        throw Error(`OTS API doesn't provide request of type '${requestType}'`);
    }

    apiVersion = apiVersion.toLowerCase();
    if (API_VERSIONS.indexOf(apiVersion) === -1) {
        throw Error(`OTS API version '${apiVersion}' not implemented`);
    }

    return new requestConfig[apiVersion](init);
}

module.exports = exports = createApiRequest;
