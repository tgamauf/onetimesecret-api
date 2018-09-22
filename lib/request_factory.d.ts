/**
 * Module provides functionality to provide API requests.
 */
import { ApiRequestInit } from "./request";
declare type RequestType = ("status" | "share" | "generate" | "retrieve_secret" | "retrieve_metadata" | "burn" | "recent_metadata");
declare type ApiVersion = "v1";
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
declare function createApiRequest(requestType: RequestType, apiVersion: ApiVersion, init: ApiRequestInit): any;
export { RequestType, ApiVersion, createApiRequest };
