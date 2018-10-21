"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ots_1 = require("./lib/ots");
exports.ConfigError = ots_1.ConfigError;
exports.OneTimeSecretApi = ots_1.OneTimeSecretApi;
var request_1 = require("./lib/request");
exports.InternalServerError = request_1.InternalServerError;
exports.NotAuthorizedError = request_1.NotAuthorizedError;
exports.NotFoundError = request_1.NotFoundError;
exports.RateLimitedError = request_1.RateLimitedError;
exports.TimeoutError = request_1.TimeoutError;
exports.UnknownSecretError = request_1.UnknownSecretError;
exports.default = ots_1.OneTimeSecretApi;
//# sourceMappingURL=index.js.map