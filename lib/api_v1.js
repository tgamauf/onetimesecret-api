/**
 * API version 1 implementation.
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
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("util");
var request_1 = require("./request");
var ApiRequestStatus = /** @class */ (function (_super) {
    __extends(ApiRequestStatus, _super);
    /**
     * Check server status.
     *
     * @constructor
     * @augments ApiRequest
     *
     */
    function ApiRequestStatus(init) {
        var _this = _super.call(this, init) || this;
        _this.path = "status";
        _this.method = "GET";
        return _this;
    }
    /**
     * Process the api request.
     *
     * @param response object received from the request
     * @returns true if server is available
     */
    ApiRequestStatus.prototype.process = function (response) {
        var isAvailable = false;
        if (response.status === "nominal") {
            isAvailable = true;
        }
        return isAvailable;
    };
    return ApiRequestStatus;
}(request_1.ApiRequest));
exports.ApiRequestStatus = ApiRequestStatus;
var ApiRequestShare = /** @class */ (function (_super) {
    __extends(ApiRequestShare, _super);
    /**
     * Send text to server for sharing.
     *
     * @constructor
     * @augments ApiRequest
     */
    function ApiRequestShare(init) {
        var _this = _super.call(this, init) || this;
        var body = { secret: init.secret };
        if (!util_1.isUndefined(init.passphrase)) {
            body.passphrase = init.passphrase;
        }
        if (!util_1.isUndefined(init.ttl)) {
            body.ttl = init.ttl;
        }
        if (!util_1.isUndefined(init.recipient)) {
            body.recipient = init.recipient;
        }
        _this.path = "share";
        _this.method = "POST";
        _this.body = request_1.urlEncodeDict(body);
        return _this;
    }
    return ApiRequestShare;
}(request_1.ApiRequest));
exports.ApiRequestShare = ApiRequestShare;
var ApiRequestGenerate = /** @class */ (function (_super) {
    __extends(ApiRequestGenerate, _super);
    /** Request a short, unique secret for sharing.
     *
     * @constructor
     * @augments ApiRequest
     */
    function ApiRequestGenerate(init) {
        var _this = _super.call(this, init) || this;
        var body = {};
        if (!util_1.isUndefined(init.passphrase)) {
            body.passphrase = init.passphrase;
        }
        if (!util_1.isUndefined(init.ttl)) {
            body.ttl = init.ttl;
        }
        if (!util_1.isUndefined(init.recipient)) {
            body.recipient = init.recipient;
        }
        _this.path = "generate";
        _this.method = "POST";
        if (Object.keys(body).length > 0) {
            _this.body = request_1.urlEncodeDict(body);
        }
        return _this;
    }
    return ApiRequestGenerate;
}(request_1.ApiRequest));
exports.ApiRequestGenerate = ApiRequestGenerate;
var ApiRequestRetrieveSecret = /** @class */ (function (_super) {
    __extends(ApiRequestRetrieveSecret, _super);
    /**
     * Retrieve a secret.
     *
     * @constructor
     * @augments ApiRequest
     */
    function ApiRequestRetrieveSecret(init) {
        var _this = _super.call(this, init) || this;
        var body = {};
        if (!util_1.isUndefined(init.passphrase)) {
            body.passphrase = init.passphrase;
        }
        _this.path = ["secret", init.secretKey].join("/");
        _this.method = "POST";
        if (Object.keys(body).length > 0) {
            _this.body = request_1.urlEncodeDict(body);
        }
        return _this;
    }
    return ApiRequestRetrieveSecret;
}(request_1.ApiRequest));
exports.ApiRequestRetrieveSecret = ApiRequestRetrieveSecret;
var ApiRequestRetrieveMetadata = /** @class */ (function (_super) {
    __extends(ApiRequestRetrieveMetadata, _super);
    /**
     * Retrieve metadata for a secret.
     *
     * @constructor
     * @augments ApiRequest
     */
    function ApiRequestRetrieveMetadata(init) {
        var _this = _super.call(this, init) || this;
        _this.path = ["private", init.metadataKey].join("/");
        _this.method = "POST";
        return _this;
    }
    return ApiRequestRetrieveMetadata;
}(request_1.ApiRequest));
exports.ApiRequestRetrieveMetadata = ApiRequestRetrieveMetadata;
var ApiRequestBurn = /** @class */ (function (_super) {
    __extends(ApiRequestBurn, _super);
    /**
     * Burn a secret.
     *
     * @constructor
     * @augments ApiRequest
     */
    function ApiRequestBurn(init) {
        var _this = _super.call(this, init) || this;
        _this.path = ["private", init.metadataKey, "burn"].join("/");
        _this.method = "POST";
        return _this;
    }
    return ApiRequestBurn;
}(request_1.ApiRequest));
exports.ApiRequestBurn = ApiRequestBurn;
var ApiRequestRecentMetadata = /** @class */ (function (_super) {
    __extends(ApiRequestRecentMetadata, _super);
    /**
     * Fetch secret metadata from the server.
     *
     * @constructor
     * @augments ApiRequest
     */
    function ApiRequestRecentMetadata(init) {
        var _this = _super.call(this, init) || this;
        _this.path = "private/recent";
        _this.method = "GET";
        return _this;
    }
    return ApiRequestRecentMetadata;
}(request_1.ApiRequest));
exports.ApiRequestRecentMetadata = ApiRequestRecentMetadata;
//# sourceMappingURL=api_v1.js.map