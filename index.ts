import {FetchError} from "node-fetch";
import {
    ApiOptionsGenerate,
    ApiOptionsRetrieveSecret,
    ApiOptionsShare,
    ApiResponseBurn,
    ApiResponseGenerate,
    ApiResponseRecentMetadata,
    ApiResponseRetrieveMetadata,
    ApiResponseRetrieveSecret,
    ApiResponseShare,
    ApiResponseState,
    ApiVersion,
    ConfigError,
    OneTimeSecretApi,
} from "./lib/ots";
import {
    NotAuthorizedError,
    NotFoundError,
    RateLimitedError,
    TimeoutError,
    UnknownSecretError,
} from "./lib/request";

export {
    FetchError,
    TimeoutError,
    UnknownSecretError,
    NotFoundError,
    NotAuthorizedError,
    RateLimitedError,
    ConfigError,
    ApiVersion,
    ApiResponseState,
    ApiOptionsShare,
    ApiResponseShare,
    ApiOptionsGenerate,
    ApiResponseGenerate,
    ApiOptionsRetrieveSecret,
    ApiResponseRetrieveSecret,
    ApiResponseRetrieveMetadata,
    ApiResponseBurn,
    ApiResponseRecentMetadata,
    OneTimeSecretApi
};
export default OneTimeSecretApi;
