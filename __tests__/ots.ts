jest.mock("node-fetch");

import {ConfigError, OneTimeSecretApi} from "../index";

// The username, apiKey, url, version, ... can have special meaning
// The meaning is defined in the node-fetch mock

// Test status and all general behaviors
test("missing credentials", async () => {
    expect.assertions(1);
    try {
        const ots = new OneTimeSecretApi(undefined, undefined);
    } catch (e) {
        expect(e.message).toEqual("No username or password provided");
    }
});

test("server status is ok", async () => {
    expect.assertions(1);
    const ots = new OneTimeSecretApi("ok_user", "ok_api_key", {url: "ok_url"});
    const response = await ots.status();
    expect(response).toBe(true);
});

test("server status is not ok", async () => {
    expect.assertions(1);
    const ots = new OneTimeSecretApi("ok_user", "ok_api_key", {url: "status_offline_url"});
    const response = await ots.status();
    expect(response).toBe(false);
});

test("status invalid credentials", async () => {
    expect.assertions(1);
    try {
        const ots = new OneTimeSecretApi("invalid_user", "ok_api_key", {url: "ok_url"});
        await ots.status();
    } catch (e) {
        expect(e.message).toEqual("Request not authorized");
    }
});

test("status invalid request", async () => {
    expect.assertions(1);
    try {
        const ots = new OneTimeSecretApi("ok_user", "ok_api_key", {url: "error_400_url"});
        await ots.status();
    } catch (e) {
        expect(e.message).toEqual(
            "url=\"error_400_url/api/v1/status\", status=400, message=\"not found\"",
        );
    }
});

test("status server error", async () => {
    expect.assertions(1);
    try {
        const ots = new OneTimeSecretApi("ok_user", "ok_api_key", {url: "error_500_url"});
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
    const ots = new OneTimeSecretApi("ok_user", "ok_api_key", {url: "ok_url"});
    const response = await ots.share("test");
    expect(response.secret_key).toEqual("test");
});

test("share with optional parameters ok", async () => {
    expect.assertions(1);
    const ots = new OneTimeSecretApi("ok_user", "ok_api_key", {url: "ok_url"});
    const response = await ots.share("test", {passphrase: "yes", ttl: 10, recipient: "me"});
    expect(response.secret_key).toEqual("test");
});

test("share missing secret", async () => {
    expect.assertions(1);
    try {
        const ots = new OneTimeSecretApi("ok_user", "ok_api_key");
        await ots.share(undefined);
    } catch (e) {
        expect(e.message).toEqual("No secret provided");
    }
});

// Test share link
test("share link ok", async () => {
    expect.assertions(1);
    const ots = new OneTimeSecretApi("ok_user", "ok_api_key", {url: "ok_url"});
    const response = await ots.shareLink("test");
    expect(response).toEqual("ok_url/secret/test");
});

test("share with optional parameters ok", async () => {
    expect.assertions(1);
    const ots = new OneTimeSecretApi("ok_user", "ok_api_key", {url: "ok_url"});
    const response = await ots.shareLink("test", {passphrase: "yes", ttl: 10, recipient: "me"});
    expect(response).toEqual("ok_url/secret/test");
});

// Test generate
test("generate ok", async () => {
    expect.assertions(1);
    const ots = new OneTimeSecretApi("ok_user", "ok_api_key", {url: "ok_url"});
    const response = await ots.generate();
    expect(response.value).toEqual("generated");
});

test("share with optional parameters ok", async () => {
    expect.assertions(1);
    const ots = new OneTimeSecretApi("ok_user", "ok_api_key", {url: "ok_url"});
    const response = await ots.generate({passphrase: "yes", ttl: 10, recipient: "me"});
    expect(response.value).toEqual("generated");
});

// Test retrieve secret
test("retrieve secret ok", async () => {
    expect.assertions(1);
    const ots = new OneTimeSecretApi("ok_user", "ok_api_key", {url: "ok_url"});
    const response = await ots.retrieve_secret("secretKey");
    expect(response.value).toEqual("secret");
});

test("retrieve secret with password ok", async () => {
    expect.assertions(1);
    const ots = new OneTimeSecretApi("ok_user", "ok_api_key", {url: "ok_url"});
    const response = await ots.retrieve_secret("secretKey", {passphrase: "yes"});
    expect(response.value).toEqual("secret");
});

test("retrieve secret missing secret key", async () => {
    expect.assertions(1);
    try {
        const ots = new OneTimeSecretApi("ok_user", "ok_api_key");
        await ots.retrieve_secret(undefined);
    } catch (e) {
        expect(e.message).toEqual("No secret_key provided");
    }
});

test("retrieve secret unknown secret key", async () => {
    expect.assertions(1);
    try {
        const ots = new OneTimeSecretApi("ok_user", "ok_api_key", {url: "ok_url"});
        await ots.retrieve_secret("unknownKey");
    } catch (e) {
        expect(e.message).toEqual("Unknown secret");
    }
});

// Test retrieve metadata
test("retrieve metadata ok", async () => {
    expect.assertions(1);
    const ots = new OneTimeSecretApi("ok_user", "ok_api_key", {url: "ok_url"});
    const response = await ots.retrieve_metadata("mykey");
    expect(response.secret_key).toEqual("secret");
});

test("retrieve metadata missing metadata key", async () => {
    expect.assertions(1);
    try {
        const ots = new OneTimeSecretApi("ok_user", "ok_api_key");
        await ots.retrieve_metadata(undefined);
    } catch (e) {
        expect(e.message).toEqual("No metadata_key provided");
    }
});

// Test burn secret
test("burn secret ok", async () => {
    expect.assertions(1);
    const ots = new OneTimeSecretApi("ok_user", "ok_api_key", {url: "ok_url"});
    const response = await ots.burn("burnKey");
    expect(response.state).toEqual("burned");
});

test("burn missing metadata key", async () => {
    expect.assertions(1);
    try {
        const ots = new OneTimeSecretApi("ok_user", "ok_api_key");
        await ots.burn(undefined);
    } catch (e) {
        expect(e.message).toEqual("No metadata_key provided");
    }
});

// Test recent metadata
test("recent metadata ok", async () => {
    expect.assertions(1);
    const ots = new OneTimeSecretApi("ok_user", "ok_api_key", {url: "ok_url"});
    const response = await ots.recent_metadata();
    expect(response).toEqual([{metadata_key: 0}]);
});
