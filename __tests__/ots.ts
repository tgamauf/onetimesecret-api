jest.mock("node-fetch");

import {OneTimeSecretApi} from "../index";

// The username, apiKey, url, version, ... can have special meaning
// The meaning is defined in the node-fetch mock

// Test status and all general behaviors
test("server status is ok", async () => {
    expect.assertions(1);
    let ots = new OneTimeSecretApi("ok_user", "ok_api_key", {url: "ok_url"});
    const response = await ots.status();
    expect(response).toBe(true);
});

test("server status is not ok", async () => {
    expect.assertions(1);
    let ots = new OneTimeSecretApi("ok_user", "ok_api_key", {url: "status_offline_url"});
    const response = await ots.status();
    expect(response).toBe(false);
});

test("invalid credentials", async () => {
    expect.assertions(1);
    try {
        let ots = new OneTimeSecretApi("invalid_user", "ok_api_key", {url: "ok_url"});
        await ots.status();
    } catch (e) {
        expect(e.message).toEqual(
            "url=\"ok_url/api/v1/status\", status=404, message=\"not authorized\"",
        );
    }
});

test("invalid request", async () => {
    expect.assertions(1);
    try {
        let ots = new OneTimeSecretApi("ok_user", "ok_api_key", {url: "error_400_url"});
        await ots.status();
    } catch (e) {
        expect(e.message).toEqual(
            "url=\"error_400_url/api/v1/status\", status=400, message=\"not found\"",
        );
    }
});

test("server error", async () => {
    expect.assertions(1);
    try {
        let ots = new OneTimeSecretApi("ok_user", "ok_api_key", {url: "error_500_url"});
        await ots.status();
    } catch (e) {
        expect(e.message).toEqual(
            "url=\"error_500_url/api/v1/status\", status=500, message=\"internal server error\"",
        );
    }
});

// Test share
test("share ok", async () => {
    expect.assertions(1);
    let ots = new OneTimeSecretApi("ok_user", "ok_api_key", {url: "ok_url"});
    const response = await ots.share("test");
    expect(response.secret_key).toEqual("test");
});

test("share with optional parameters ok", async () => {
    expect.assertions(1);
    let ots = new OneTimeSecretApi("ok_user", "ok_api_key", {url: "ok_url"});
    const response = await ots.share("test", {passphrase: "yes", ttl: 10, recipient: "me"});
    expect(response.secret_key).toEqual("test");
});

// Test share link
test("share link ok", async () => {
    expect.assertions(1);
    let ots = new OneTimeSecretApi("ok_user", "ok_api_key", {url: "ok_url"});
    const response = await ots.shareLink("test");
    expect(response).toEqual("ok_url/secret/test");
});

test("share with optional parameters ok", async () => {
    expect.assertions(1);
    let ots = new OneTimeSecretApi("ok_user", "ok_api_key", {url: "ok_url"});
    const response = await ots.shareLink("test", {passphrase: "yes", ttl: 10, recipient: "me"});
    expect(response).toEqual("ok_url/secret/test");
});

// Test generate
test("generate ok", async () => {
    expect.assertions(1);
    let ots = new OneTimeSecretApi("ok_user", "ok_api_key", {url: "ok_url"});
    const response = await ots.generate();
    expect(response.value).toEqual("generated");
});

test("share with optional parameters ok", async () => {
    expect.assertions(1);
    let ots = new OneTimeSecretApi("ok_user", "ok_api_key", {url: "ok_url"});
    const response = await ots.generate({passphrase: "yes", ttl: 10, recipient: "me"});
    expect(response.value).toEqual("generated");
});

// Test retrieve secret
test("retrieve secret ok", async () => {
    expect.assertions(1);
    let ots = new OneTimeSecretApi("ok_user", "ok_api_key", {url: "ok_url"});
    const response = await ots.retrieve_secret("mykey");
    expect(response.value).toEqual("secret");
});

test("retrieve secret with password ok", async () => {
    expect.assertions(1);
    let ots = new OneTimeSecretApi("ok_user", "ok_api_key", {url: "ok_url"});
    const response = await ots.retrieve_secret("mykey", {passphrase: "yes"});
    expect(response.value).toEqual("secret");
});

// Test retrieve metadata
test("retrieve metadata ok", async () => {
    expect.assertions(1);
    let ots = new OneTimeSecretApi("ok_user", "ok_api_key", {url: "ok_url"});
    const response = await ots.retrieve_metadata("mykey");
    expect(response.secret_key).toEqual("secret");
});

// Test burn secret
test("burn secret ok", async () => {
    expect.assertions(1);
    let ots = new OneTimeSecretApi("ok_user", "ok_api_key", {url: "ok_url"});
    const response = await ots.burn("burnKey");
    expect(response.state).toEqual("burned");
});

// Test recent metadata
test("recent metadata ok", async () => {
    expect.assertions(1);
    let ots = new OneTimeSecretApi("ok_user", "ok_api_key", {url: "ok_url"});
    const response = await ots.recent_metadata();
    expect(response).toEqual([{metadata_key: 0}]);
});
