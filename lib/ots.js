/**
 * API implementation.
 */
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var request_factory_1 = require("./request_factory");
var DEFAULT_URL = "https://onetimesecret.com";
var DEFAULT_API_VERSION = "v1";
var OneTimeSecretApi = /** @class */ (function () {
    /**
     * Create object for interaction with OTS.
     *
     * @param username  OTS password
     * @param password API key of OTS account
     * @param options optional parameters
     */
    function OneTimeSecretApi(username, password, options) {
        var defaultOptions = {
            apiVersion: DEFAULT_API_VERSION,
            url: DEFAULT_URL,
        };
        this.init = __assign({ username: username,
            password: password }, defaultOptions, options);
        // The api version is also required in the request
        this.apiVersion = this.init.apiVersion;
    }
    /**
     * Request the server status.
     *
     * @returns promise that returns true if server is available
     * @throws error if connection/request fails
     */
    OneTimeSecretApi.prototype.status = function () {
        return __awaiter(this, void 0, void 0, function () {
            var request;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        request = request_factory_1.createApiRequest("status", this.apiVersion, this.init);
                        return [4 /*yield*/, request.send()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Share a secret.
     * Please check the API description for the other available keys:
     * https://onetimesecret.com/docs/api/secrets
     *
     * @param secret the secret value to encrypt and share (max. 1k-10k length
     *      depending on your account)
     * @param options optional parameters
     * @returns promise that returns response object
     * @throws error if no secret defined or connection/request fails
     */
    OneTimeSecretApi.prototype.share = function (secret, options) {
        return __awaiter(this, void 0, void 0, function () {
            var init, request;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        init = __assign({}, JSON.parse(JSON.stringify(this.init)), { secret: secret }, options);
                        request = request_factory_1.createApiRequest("share", this.apiVersion, init);
                        return [4 /*yield*/, request.send()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Share a secret and get the link.
     *
     * @param secret the secret value to encrypt and share (max. 1k-10k length
     *      depending on your account)
     * @param options optional parameters
     * @returns promise that returns response object
     * @throws error if no secret defined or connection/request fails
     */
    OneTimeSecretApi.prototype.shareLink = function (secret, options) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.share(secret, options)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, this.createSecretUrl(response.secret_key)];
                }
            });
        });
    };
    /**
     * Generate a short, unique secret.
     * Please check the API description for the other available keys:
     * https://onetimesecret.com/docs/api/secrets
     *
     * @param options optional parameters
     * @returns that returns response object
     * @throws error if connection/request fails
     */
    OneTimeSecretApi.prototype.generate = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var init, request;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        init = __assign({}, JSON.parse(JSON.stringify(this.init)), options);
                        request = request_factory_1.createApiRequest("generate", this.apiVersion, init);
                        return [4 /*yield*/, request.send()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Retrieve the secret specified by the key.
     * Please check the API description for the other available keys:
     * https://onetimesecret.com/docs/api/secrets
     *
     * @param secretKey secret key of the secret
     * @param options optional parameters
     * @returns that returns response object
     * @throws error if no secret key defined or connection/request fails
     */
    OneTimeSecretApi.prototype.retrieve_secret = function (secretKey, options) {
        return __awaiter(this, void 0, void 0, function () {
            var init, request;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        init = __assign({}, JSON.parse(JSON.stringify(this.init)), { secretKey: secretKey }, options);
                        request = request_factory_1.createApiRequest("retrieve_secret", this.apiVersion, init);
                        return [4 /*yield*/, request.send()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Retrieve the metadata of the secret specified by the key.
     * Please check the API description for the other available keys:
     * https://onetimesecret.com/docs/api/secrets
     *
     * @param metadataKey: private, unique key of the secret used for secret
     *      management
     * @returns promise that returns response object
     * @throws error if no metadata key defined or connection/request fails
     */
    OneTimeSecretApi.prototype.retrieve_metadata = function (metadataKey) {
        return __awaiter(this, void 0, void 0, function () {
            var init, request;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        init = __assign({}, JSON.parse(JSON.stringify(this.init)), { metadataKey: metadataKey });
                        request = request_factory_1.createApiRequest("retrieve_metadata", this.apiVersion, init);
                        return [4 /*yield*/, request.send()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Retrieve the metadata of the secret specified by the key.
     * Please check the API description for the other available keys:
     * https://onetimesecret.com/docs/api/secrets
     *
     * @param metadataKey private, unique key of the secret used for secret
     *      management
     * @returns promise that returns response object
     * @throws error if no metadata key defined or connection/request fails
     */
    OneTimeSecretApi.prototype.burn = function (metadataKey) {
        return __awaiter(this, void 0, void 0, function () {
            var init, request;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        init = __assign({}, JSON.parse(JSON.stringify(this.init)), { metadataKey: metadataKey });
                        request = request_factory_1.createApiRequest("burn", this.apiVersion, init);
                        return [4 /*yield*/, request.send()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Retrieve a list of recent metadata.
     * Please check the API description for the other available keys:
     * https://onetimesecret.com/docs/api/secrets
     *
     * @returns promise that returns response object
     * @throws error if connection/request fails
     */
    OneTimeSecretApi.prototype.recent_metadata = function () {
        return __awaiter(this, void 0, void 0, function () {
            var request;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        request = request_factory_1.createApiRequest("recent_metadata", this.apiVersion, this.init);
                        return [4 /*yield*/, request.send()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /** Create the secret link from the secret. */
    OneTimeSecretApi.prototype.createSecretUrl = function (secretKey) {
        return [this.init.url, "secret", secretKey].join("/");
    };
    return OneTimeSecretApi;
}());
exports.OneTimeSecretApi = OneTimeSecretApi;
//# sourceMappingURL=ots.js.map