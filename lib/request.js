/**
 * Module defines generic requests.
 */
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var buffer_1 = require("buffer");
var cross_fetch_1 = __importStar(require("cross-fetch"));
// setPrototypeOf polyfill for React Native Android
Object.setPrototypeOf =
    Object.setPrototypeOf ||
        function (obj, proto) {
            obj.__proto__ = proto;
            return obj;
        };
var API_PATH = "api";
var FETCH_TIMEOUT_S = 30;
var TimeoutError = /** @class */ (function (_super) {
    __extends(TimeoutError, _super);
    function TimeoutError(message) {
        var _this = _super.call(this, message) || this;
        Object.setPrototypeOf(_this, TimeoutError.prototype);
        return _this;
    }
    return TimeoutError;
}(Error));
exports.TimeoutError = TimeoutError;
var UnknownSecretError = /** @class */ (function (_super) {
    __extends(UnknownSecretError, _super);
    function UnknownSecretError(message) {
        var _this = _super.call(this, message) || this;
        Object.setPrototypeOf(_this, UnknownSecretError.prototype);
        return _this;
    }
    return UnknownSecretError;
}(Error));
exports.UnknownSecretError = UnknownSecretError;
var NotFoundError = /** @class */ (function (_super) {
    __extends(NotFoundError, _super);
    function NotFoundError(message) {
        var _this = _super.call(this, message) || this;
        Object.setPrototypeOf(_this, NotFoundError.prototype);
        return _this;
    }
    return NotFoundError;
}(Error));
exports.NotFoundError = NotFoundError;
var NotAuthorizedError = /** @class */ (function (_super) {
    __extends(NotAuthorizedError, _super);
    function NotAuthorizedError(message) {
        var _this = _super.call(this, message) || this;
        Object.setPrototypeOf(_this, NotAuthorizedError.prototype);
        return _this;
    }
    return NotAuthorizedError;
}(Error));
exports.NotAuthorizedError = NotAuthorizedError;
var RateLimitedError = /** @class */ (function (_super) {
    __extends(RateLimitedError, _super);
    function RateLimitedError(message) {
        var _this = _super.call(this, message) || this;
        Object.setPrototypeOf(_this, RateLimitedError.prototype);
        return _this;
    }
    return RateLimitedError;
}(Error));
exports.RateLimitedError = RateLimitedError;
var InternalServerError = /** @class */ (function (_super) {
    __extends(InternalServerError, _super);
    function InternalServerError(message) {
        var _this = _super.call(this, message) || this;
        Object.setPrototypeOf(_this, InternalServerError.prototype);
        return _this;
    }
    return InternalServerError;
}(Error));
exports.InternalServerError = InternalServerError;
var NetworkError = /** @class */ (function (_super) {
    __extends(NetworkError, _super);
    function NetworkError(message) {
        var _this = _super.call(this, message) || this;
        Object.setPrototypeOf(_this, NetworkError.prototype);
        return _this;
    }
    return NetworkError;
}(Error));
var CORSError = /** @class */ (function (_super) {
    __extends(CORSError, _super);
    function CORSError(message) {
        var _this = _super.call(this, message) || this;
        Object.setPrototypeOf(_this, CORSError.prototype);
        return _this;
    }
    return CORSError;
}(Error));
/**
 * Join up the parameters in the dict to conform to
 * application/x-www-form-urlencoded encoding.
 *
 * @param data dictionary of parameters
 * @returns encoded data
 */
function urlEncodeDict(data) {
    var parameters = [];
    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            var encodedKey = encodeURIComponent(key);
            var encodedValue = encodeURIComponent(data[key]);
            var parameter = [encodedKey, encodedValue].join("=");
            parameters.push(parameter);
        }
    }
    return parameters.join("&");
}
exports.urlEncodeDict = urlEncodeDict;
/**
 * Execute a request using the fetch API and raise an exception if an timeout
 * occurred.
 *
 * @param url request url - passed to fetch
 * @param options fetch options - passed to fetch
 * @returns response object
 * @throws error on timeout and if fetch fails
 */
function fetchWithTimeout(url, 
// TODO Promise should actually be type Response, but this doesn't work
options) {
    return __awaiter(this, void 0, void 0, function () {
        var fetchTimeout, init;
        return __generator(this, function (_a) {
            if (typeof options.timeoutS !== "undefined") {
                fetchTimeout = options.timeoutS * 1000;
            }
            if (typeof options.init !== "undefined") {
                init = options.init;
            }
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    var didTimeOut = false;
                    var timeout;
                    if (typeof fetchTimeout !== "undefined") {
                        timeout = setTimeout(function () {
                            didTimeOut = true;
                            reject(new TimeoutError("Request timed out"));
                        }, fetchTimeout);
                    }
                    cross_fetch_1.default(url, init)
                        // @ts-ignore
                        .then(function (response) {
                        if (timeout) {
                            // Clear the timeout as cleanup
                            clearTimeout(timeout);
                        }
                        if (!didTimeOut) {
                            resolve(response);
                        }
                    })
                        .catch(function (error) {
                        // Rejection already happened with setTimeout
                        if (didTimeOut) {
                            return;
                        }
                        else if (timeout) {
                            // Clear the timeout as cleanup
                            clearTimeout(timeout);
                        }
                        var parsedError = error;
                        if (error instanceof TypeError) {
                            if (error.message.indexOf("Network Request Failed") != -1) {
                                parsedError = new NetworkError("Network request failed");
                            }
                            else {
                                parsedError = new CORSError("CORS error");
                            }
                        }
                        reject(parsedError);
                    });
                })];
        });
    });
}
var ApiRequest = /** @class */ (function () {
    /**
     * Create a OTS API request.
     *
     * @abstract
     * @constructor
     * @param init request parameters
     * @throws error if username, apiKey, url, or apiVersion not defined
     */
    function ApiRequest(init) {
        var authorization = ("Basic " + buffer_1.Buffer.from(init.username + ":" + init.password)
            .toString("base64"));
        this.headers = new cross_fetch_1.Headers();
        this.headers.append("Authorization", authorization);
        this.headers.append("Accept", "application/json");
        this.headers.append("Content-Type", "application/x-www-form-urlencoded");
        this.apiUrl = [init.url, API_PATH, init.apiVersion].join("/");
    }
    /**
     * Send the request to the server and wait for the result.
     *
     * @param options send options
     * @returns that returns a processed response object
     * @throws error on failed request or timeout
     */
    ApiRequest.prototype.send = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var defaultOptions, _a, url, init, response, contentType, error, jsonResponse;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        defaultOptions = { timeoutS: FETCH_TIMEOUT_S };
                        _a = this.prepare(), url = _a[0], init = _a[1];
                        return [4 /*yield*/, fetchWithTimeout(url, __assign({ init: init }, defaultOptions, options))];
                    case 1:
                        response = _b.sent();
                        if (!response.ok) {
                            if (response.status === 500) {
                                throw new InternalServerError("url=\"" + url + "\", status=" + response.status + ", "
                                    + ("message=\"" + response.statusText + "\""));
                            }
                            if (typeof response.headers === "undefined") {
                                throw new Error("url='" + url + "', status=" + response.status + ", "
                                    + ("message='" + response.statusText + "', headers missing"));
                            }
                            contentType = response.headers.get("Content-Type");
                            if (contentType && contentType.indexOf("application/json") !== -1) {
                                return [2 /*return*/, response.json().then(function (data) {
                                        var error;
                                        switch (data.message) {
                                            case "Unknown secret":
                                                error = new UnknownSecretError("Unknown secret");
                                                break;
                                            case "Not Found":
                                                error = new NotFoundError("Metadata not found");
                                                break;
                                            case "Not authorized":
                                                error = new NotAuthorizedError("Request not authorized");
                                                break;
                                            case "Apologies dear citizen! You have been rate limited.":
                                                error = new RateLimitedError("You have been rate limited.");
                                                break;
                                            default:
                                                error = new Error("url=\"" + url + "\", status=" + response.status + ", "
                                                    + ("message=\"" + data.message + "\""));
                                        }
                                        throw error;
                                    })];
                            }
                            else {
                                error = null;
                                switch (response.statusText) {
                                    case "Not Found":
                                        error = new NotFoundError("Path not found");
                                        break;
                                    default:
                                        error = new Error("url=\"" + url + "\", status=" + response.status + ", "
                                            + ("message=\"" + response.statusText + "\""));
                                }
                                throw error;
                            }
                        }
                        return [4 /*yield*/, response.json()];
                    case 2:
                        jsonResponse = _b.sent();
                        return [2 /*return*/, this.process(jsonResponse)];
                }
            });
        });
    };
    /**
     * Prepare an api request.
     *
     * @returns of format [url, init]
     * @throws error if path or method not set
     */
    ApiRequest.prototype.prepare = function () {
        var url = [this.apiUrl, this.path].join("/");
        var init = {
            headers: this.headers,
            method: this.method,
        };
        if (this.method !== "GET" && this.body) {
            init.body = this.body;
        }
        return [url, init];
    };
    /**
     * Process the api request.
     *
     * @static
     * @param response object received from the request
     * @returns processed response object
     */
    ApiRequest.prototype.process = function (response) {
        return response;
    };
    return ApiRequest;
}());
exports.ApiRequest = ApiRequest;
//# sourceMappingURL=request.js.map