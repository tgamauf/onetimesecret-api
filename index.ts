import {
    ApiOptions,
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
    InputError,
    OneTimeSecretApi,
} from "./lib/ots";
import {
    InternalServerError,
    NetworkError,
    NotAuthorizedError,
    NotFoundError,
    RateLimitedError,
    TimeoutError,
    UnknownSecretError,
} from "./lib/request";

export default OneTimeSecretApi;
export {
    InputError,
    InternalServerError,
    NetworkError,
    NotAuthorizedError,
    NotFoundError,
    RateLimitedError,
    TimeoutError,
    UnknownSecretError,
    OneTimeSecretApi
};
export type {
    ApiOptions,
    ApiOptionsGenerate,
    ApiOptionsRetrieveSecret,
    ApiOptionsShare,
    ApiResponseBurn,
    ApiResponseGenerate,
    ApiResponseRecentMetadata,
    ApiResponseRetrieveMetadata,
    ApiResponseRetrieveSecret,
    ApiResponseState,
    ApiResponseShare,
    ApiVersion,
}
