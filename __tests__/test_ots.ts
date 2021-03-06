jest.mock("cross-fetch");

import {OneTimeSecretApi} from "../index";

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
            "Path not found",
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
    expect.assertions(2);
    const ots = new OneTimeSecretApi("ok_user", "ok_api_key", {url: "ok_url"});
    const response = await ots.share("test");
    expect(response.secret_key).toEqual("test");
    expect(response.share_link).toEqual("ok_url/secret/test");
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

// Test generate
test("generate ok", async () => {
    expect.assertions(2);
    const ots = new OneTimeSecretApi("ok_user", "ok_api_key", {url: "ok_url"});
    const response = await ots.generate();
    expect(response.secret_key).toEqual("generated");
    expect(response.share_link).toEqual("ok_url/secret/generated");
});

test("share with optional parameters ok", async () => {
    expect.assertions(1);
    const ots = new OneTimeSecretApi("ok_user", "ok_api_key", {url: "ok_url"});
    const response = await ots.generate({passphrase: "yes", ttl: 10, recipient: "me"});
    expect(response.secret_key).toEqual("generated");
});

// Test retrieve secret
test("retrieve secret ok", async () => {
    expect.assertions(1);
    const ots = new OneTimeSecretApi("ok_user", "ok_api_key", {url: "ok_url"});
    const response = await ots.retrieveSecret("retrieveSecretKeyOk123456789012");
    expect(response.value).toEqual("secret");
});

test("retrieve secret with password ok", async () => {
    expect.assertions(1);
    const ots = new OneTimeSecretApi("ok_user", "ok_api_key", {url: "ok_url"});
    const response = await ots.retrieveSecret("retrieveSecretKeyOk123456789012", {passphrase: "yes"});
    expect(response.value).toEqual("secret");
});

test("retrieve secret missing secret key", async () => {
    expect.assertions(1);
    try {
        const ots = new OneTimeSecretApi("ok_user", "ok_api_key");
        await ots.retrieveSecret(undefined);
    } catch (e) {
        expect(e.message).toEqual("Invalid key provided: undefined");
    }
});

test("retrieve secret invalid secret key", async () => {
    expect.assertions(1);
    try {
        const ots = new OneTimeSecretApi("ok_user", "ok_api_key");
        await ots.retrieveSecret("IAmToShort");
    } catch (e) {
        expect(e.message).toEqual("Invalid key provided: IAmToShort");
    }
});

test("retrieve secret unknown secret key", async () => {
    expect.assertions(1);
    try {
        const ots = new OneTimeSecretApi("ok_user", "ok_api_key", {url: "ok_url"});
        await ots.retrieveSecret("retrieveSecretKeyUnknown1234567");
    } catch (e) {
        expect(e.message).toEqual("Unknown secret");
    }
});

// Test retrieve metadata
test("retrieve metadata ok", async () => {
    expect.assertions(2);
    const ots = new OneTimeSecretApi("ok_user", "ok_api_key", {url: "ok_url"});
    const response = await ots.retrieveMetadata("retrieveMetadataOk1234567890123");
    expect(response.secret_key).toEqual("secret");
    expect(response.share_link).toEqual("ok_url/secret/secret");
});

// Test retrieve metadata of burned secret
test("retrieve metadata burned ok", async () => {
    expect.assertions(2);
    let ots = new OneTimeSecretApi("ok_user", "ok_api_key", {url: "ok_url"});
    const response = await ots.retrieveMetadata("retrieveMetadataBurnedOk1234567");
    expect(response.metadata_key).toEqual("metadata");
    expect(response.share_link).toBeUndefined();
});

test("retrieve metadata missing metadata key", async () => {
    expect.assertions(1);
    try {
        const ots = new OneTimeSecretApi("ok_user", "ok_api_key");
        await ots.retrieveMetadata(undefined);
    } catch (e) {
        expect(e.message).toEqual("Invalid key provided: undefined");
    }
});

test("retrieve metadata invalid metadata key", async () => {
    expect.assertions(1);
    try {
        const ots = new OneTimeSecretApi("ok_user", "ok_api_key");
        await ots.retrieveMetadata("IAmTooShort");
    } catch (e) {
        expect(e.message).toEqual("Invalid key provided: IAmTooShort");
    }
});

// Test burn secret
test("burn secret ok", async () => {
    expect.assertions(1);
    const ots = new OneTimeSecretApi("ok_user", "ok_api_key", {url: "ok_url"});
    const response = await ots.burn("hbo11uxhmg2gze0mlcmyf4x0qahawqa");
    expect(response.state).toEqual("burned");
});

test("burn missing metadata key", async () => {
    expect.assertions(1);
    try {
        const ots = new OneTimeSecretApi("ok_user", "ok_api_key");
        await ots.burn(undefined);
    } catch (e) {
        expect(e.message).toEqual("Invalid key provided: undefined");
    }
});

// Test recent metadata
test("recent metadata ok", async () => {
    expect.assertions(1);
    const ots = new OneTimeSecretApi("ok_user", "ok_api_key", {url: "ok_url"});
    const response = await ots.recentMetadata();
    expect(response).toEqual([{metadata_key: 0}]);
});

test("recent metadata ok", async () => {
    expect.assertions(1);
    const ots = new OneTimeSecretApi("ok_user", "ok_api_key", {url: "ok_url"});
    const response = await ots.recentMetadata();
    expect(response).toEqual([{metadata_key: 0}]);
});
