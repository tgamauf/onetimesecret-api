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
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var request_1 = require("./request");
var ApiRequestV1 = /** @class */ (function (_super) {
    __extends(ApiRequestV1, _super);
    function ApiRequestV1() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.keyRegex = new RegExp("^[A-Za-z0-9]{31}$");
        return _this;
    }
    return ApiRequestV1;
}(request_1.ApiRequest));
var ApiRequestStatus = /** @class */ (function (_super) {
    __extends(ApiRequestStatus, _super);
    /**
     * Check server status.
     *
     * @constructor
     * @augments ApiRequestV1
     */
    function ApiRequestStatus(init) {
        var _this = _super.call(this, init) || this;
        _this.path = "status";
        _this.method = "GET";
        return _this;
    }
    /**
     * Convert server status to boolean.
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
}(ApiRequestV1));
exports.ApiRequestStatus = ApiRequestStatus;
var ApiRequestShare = /** @class */ (function (_super) {
    __extends(ApiRequestShare, _super);
    /**
     * Send text to server for sharing.
     *
     * @constructor
     * @augments ApiRequestV1
     */
    function ApiRequestShare(init) {
        var _this = _super.call(this, init) || this;
        var body = { secret: init.secret };
        if (typeof init.passphrase !== "undefined") {
            body.passphrase = init.passphrase;
        }
        if (typeof init.ttl !== "undefined") {
            body.ttl = init.ttl;
        }
        if (typeof init.recipient !== "undefined") {
            body.recipient = init.recipient;
        }
        _this.path = "share";
        _this.method = "POST";
        _this.body = request_1.urlEncodeDict(body);
        return _this;
    }
    return ApiRequestShare;
}(ApiRequestV1));
exports.ApiRequestShare = ApiRequestShare;
var ApiRequestGenerate = /** @class */ (function (_super) {
    __extends(ApiRequestGenerate, _super);
    /** Request a short, unique secret for sharing.
     *
     * @constructor
     * @augments ApiRequestV1
     */
    function ApiRequestGenerate(init) {
        var _this = _super.call(this, init) || this;
        var body = {};
        if (typeof init.passphrase !== "undefined") {
            body.passphrase = init.passphrase;
        }
        if (typeof init.ttl !== "undefined") {
            body.ttl = init.ttl;
        }
        if (typeof init.recipient !== "undefined") {
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
}(ApiRequestV1));
exports.ApiRequestGenerate = ApiRequestGenerate;
var ApiRequestRetrieveSecret = /** @class */ (function (_super) {
    __extends(ApiRequestRetrieveSecret, _super);
    /**
     * Retrieve a secret.
     *
     * @constructor
     * @augments ApiRequestV1
     */
    function ApiRequestRetrieveSecret(init) {
        var _this = _super.call(this, init) || this;
        _this.checkValidKey(init.secretKey);
        var body = {};
        if (typeof init.passphrase !== "undefined") {
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
}(ApiRequestV1));
exports.ApiRequestRetrieveSecret = ApiRequestRetrieveSecret;
var ApiRequestRetrieveMetadata = /** @class */ (function (_super) {
    __extends(ApiRequestRetrieveMetadata, _super);
    /**
     * Retrieve metadata for a secret.
     *
     * @constructor
     * @augments ApiRequestV1
     */
    function ApiRequestRetrieveMetadata(init) {
        var _this = _super.call(this, init) || this;
        _this.checkValidKey(init.metadataKey);
        _this.path = ["private", init.metadataKey].join("/");
        _this.method = "POST";
        return _this;
    }
    return ApiRequestRetrieveMetadata;
}(ApiRequestV1));
exports.ApiRequestRetrieveMetadata = ApiRequestRetrieveMetadata;
var ApiRequestBurn = /** @class */ (function (_super) {
    __extends(ApiRequestBurn, _super);
    /**
     * Burn a secret.
     *
     * @constructor
     * @augments ApiRequestV1
     */
    function ApiRequestBurn(init) {
        var _this = _super.call(this, init) || this;
        _this.checkValidKey(init.metadataKey);
        _this.path = ["private", init.metadataKey, "burn"].join("/");
        _this.method = "POST";
        return _this;
    }
    return ApiRequestBurn;
}(ApiRequestV1));
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