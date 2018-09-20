"use strict";
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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
jest.mock("node-fetch");
var index_1 = require("../index");
// The username, apiKey, url, version, ... can have special meaning
// The meaning is defined in the node-fetch mock
// Test status and all general behaviors
test("server status is ok", function () { return __awaiter(_this, void 0, void 0, function () {
    var ots, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                expect.assertions(1);
                ots = new index_1.OneTimeSecretApi("ok_user", "ok_api_key", { url: "ok_url" });
                return [4 /*yield*/, ots.status()];
            case 1:
                response = _a.sent();
                expect(response).toBe(true);
                return [2 /*return*/];
        }
    });
}); });
test("server status is not ok", function () { return __awaiter(_this, void 0, void 0, function () {
    var ots, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                expect.assertions(1);
                ots = new index_1.OneTimeSecretApi("ok_user", "ok_api_key", { url: "status_offline_url" });
                return [4 /*yield*/, ots.status()];
            case 1:
                response = _a.sent();
                expect(response).toBe(false);
                return [2 /*return*/];
        }
    });
}); });
test("invalid credentials", function () { return __awaiter(_this, void 0, void 0, function () {
    var ots, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                expect.assertions(1);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                ots = new index_1.OneTimeSecretApi("invalid_user", "ok_api_key", { url: "ok_url" });
                return [4 /*yield*/, ots.status()];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                e_1 = _a.sent();
                expect(e_1.message).toEqual("url='ok_url/api/v1/status', status=404, message='not authorized'");
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
test("invalid request", function () { return __awaiter(_this, void 0, void 0, function () {
    var ots, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                expect.assertions(1);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                ots = new index_1.OneTimeSecretApi("ok_user", "ok_api_key", { url: "error_400_url" });
                return [4 /*yield*/, ots.status()];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                e_2 = _a.sent();
                expect(e_2.message).toEqual("url='error_400_url/api/v1/status', status=400, message='not found'");
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
test("server error", function () { return __awaiter(_this, void 0, void 0, function () {
    var ots, e_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                expect.assertions(1);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                ots = new index_1.OneTimeSecretApi("ok_user", "ok_api_key", { url: "error_500_url" });
                return [4 /*yield*/, ots.status()];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                e_3 = _a.sent();
                expect(e_3.message).toEqual("url='error_500_url/api/v1/status', status=500, message='internal server error'");
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Test share
test("share ok", function () { return __awaiter(_this, void 0, void 0, function () {
    var ots, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                expect.assertions(1);
                ots = new index_1.OneTimeSecretApi("ok_user", "ok_api_key", { url: "ok_url" });
                return [4 /*yield*/, ots.share("test")];
            case 1:
                response = _a.sent();
                expect(response.secret_key).toEqual("test");
                return [2 /*return*/];
        }
    });
}); });
test("share with optional parameters ok", function () { return __awaiter(_this, void 0, void 0, function () {
    var ots, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                expect.assertions(1);
                ots = new index_1.OneTimeSecretApi("ok_user", "ok_api_key", { url: "ok_url" });
                return [4 /*yield*/, ots.share("test", { passphrase: "yes", ttl: 10, recipient: "me" })];
            case 1:
                response = _a.sent();
                expect(response.secret_key).toEqual("test");
                return [2 /*return*/];
        }
    });
}); });
// Test share link
test("share link ok", function () { return __awaiter(_this, void 0, void 0, function () {
    var ots, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                expect.assertions(1);
                ots = new index_1.OneTimeSecretApi("ok_user", "ok_api_key", { url: "ok_url" });
                return [4 /*yield*/, ots.shareLink("test")];
            case 1:
                response = _a.sent();
                expect(response).toEqual("ok_url/secret/test");
                return [2 /*return*/];
        }
    });
}); });
test("share with optional parameters ok", function () { return __awaiter(_this, void 0, void 0, function () {
    var ots, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                expect.assertions(1);
                ots = new index_1.OneTimeSecretApi("ok_user", "ok_api_key", { url: "ok_url" });
                return [4 /*yield*/, ots.shareLink("test", { passphrase: "yes", ttl: 10, recipient: "me" })];
            case 1:
                response = _a.sent();
                expect(response).toEqual("ok_url/secret/test");
                return [2 /*return*/];
        }
    });
}); });
// Test generate
test("generate ok", function () { return __awaiter(_this, void 0, void 0, function () {
    var ots, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                expect.assertions(1);
                ots = new index_1.OneTimeSecretApi("ok_user", "ok_api_key", { url: "ok_url" });
                return [4 /*yield*/, ots.generate()];
            case 1:
                response = _a.sent();
                expect(response.value).toEqual("generated");
                return [2 /*return*/];
        }
    });
}); });
test("share with optional parameters ok", function () { return __awaiter(_this, void 0, void 0, function () {
    var ots, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                expect.assertions(1);
                ots = new index_1.OneTimeSecretApi("ok_user", "ok_api_key", { url: "ok_url" });
                return [4 /*yield*/, ots.generate({ passphrase: "yes", ttl: 10, recipient: "me" })];
            case 1:
                response = _a.sent();
                expect(response.value).toEqual("generated");
                return [2 /*return*/];
        }
    });
}); });
// Test retrieve secret
test("retrieve secret ok", function () { return __awaiter(_this, void 0, void 0, function () {
    var ots, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                expect.assertions(1);
                ots = new index_1.OneTimeSecretApi("ok_user", "ok_api_key", { url: "ok_url" });
                return [4 /*yield*/, ots.retrieve_secret("mykey")];
            case 1:
                response = _a.sent();
                expect(response.value).toEqual("secret");
                return [2 /*return*/];
        }
    });
}); });
test("retrieve secret with password ok", function () { return __awaiter(_this, void 0, void 0, function () {
    var ots, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                expect.assertions(1);
                ots = new index_1.OneTimeSecretApi("ok_user", "ok_api_key", { url: "ok_url" });
                return [4 /*yield*/, ots.retrieve_secret("mykey", { passphrase: "yes" })];
            case 1:
                response = _a.sent();
                expect(response.value).toEqual("secret");
                return [2 /*return*/];
        }
    });
}); });
// Test retrieve metadata
test("retrieve metadata ok", function () { return __awaiter(_this, void 0, void 0, function () {
    var ots, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                expect.assertions(1);
                ots = new index_1.OneTimeSecretApi("ok_user", "ok_api_key", { url: "ok_url" });
                return [4 /*yield*/, ots.retrieve_metadata("mykey")];
            case 1:
                response = _a.sent();
                expect(response.secret_key).toEqual("secret");
                return [2 /*return*/];
        }
    });
}); });
// Test burn secret
test("burn secret ok", function () { return __awaiter(_this, void 0, void 0, function () {
    var ots, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                expect.assertions(1);
                ots = new index_1.OneTimeSecretApi("ok_user", "ok_api_key", { url: "ok_url" });
                return [4 /*yield*/, ots.burn("burnKey")];
            case 1:
                response = _a.sent();
                expect(response.state).toEqual("burned");
                return [2 /*return*/];
        }
    });
}); });
// Test recent metadata
test("recent metadata ok", function () { return __awaiter(_this, void 0, void 0, function () {
    var ots, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                expect.assertions(1);
                ots = new index_1.OneTimeSecretApi("ok_user", "ok_api_key", { url: "ok_url" });
                return [4 /*yield*/, ots.recent_metadata()];
            case 1:
                response = _a.sent();
                expect(response).toEqual([{ metadata_key: 0 }]);
                return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=ots.js.map