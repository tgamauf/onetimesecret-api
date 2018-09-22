import {Buffer} from "buffer";

const OK_USER = "ok_user";
const OK_API_KEY = "ok_api_key";
const OK_API_VERSION = "v1";
const OK_URL = "ok_url";
const STATUS_OFFLINE_URL = "status_offline_url";
const ERROR_400_URL = "error_400_url";
const ERROR_500_URL = "error_500_url";
const OK_AUTH = "Basic "+Buffer.from(OK_USER+":"+OK_API_KEY).toString("base64");
const OK_ACCEPT = "application/json";
const OK_CONTENT_TYPE = "application/x-www-form-urlencoded";

class Headers {
    data: object;

    constructor() {
        this.data = {};
    }

    append(key, value) {
        this.data[key] = value;
    }

    get(key) {
        return this.data[key];
    }
}

class Response {
    body: any;
    ok: boolean;
    status: number;
    statusText: string;
    headers: Headers;

    constructor(body, init) {
        this.body = body;
        this.ok = init.ok;
        this.status = init.status;
        this.statusText = init.statusText;
        this.headers = init.headers;
    }

    json() {
        return new Promise((resolve, reject) => {
            resolve(this.body);
        });
    }
}

const ERROR_RESPONSE_HEADER = new Headers();
ERROR_RESPONSE_HEADER.append("Content-Type", "text/plain");
const ERROR_RESPONSE_HEADER_JSON = new Headers();
ERROR_RESPONSE_HEADER_JSON.append("Content-Type", "application/json");

const BASE_PATH_REGEX = `${[OK_URL, "api", OK_API_VERSION].join("/")}`;
const REQUESTS = [
    {
        // status
        PATH_PATTERN: new RegExp(`${[BASE_PATH_REGEX, "status"].join("/")}`),
        METHOD: "GET",
        BODY: null,
        RESPONSE: new Response({status: "nominal"}, {ok: true, status: 200})
    },
    {
        // share
        PATH_PATTERN: new RegExp(`${[BASE_PATH_REGEX, "share"].join("/")}`),
        METHOD: "POST",
        BODY: new RegExp("(?:^secret=\\w+$)|(?:^secret=\\w+&passphrase=\\w+&ttl=\\d+&recipient=\\w+$)"),
        BODY_REQUIRED: true,
        RESPONSE: new Response({secret_key: "test"}, {ok: true, status: 200})
    },
    {
        // generate
        PATH_PATTERN: new RegExp(`${[BASE_PATH_REGEX, "generate"].join("/")}`),
        METHOD: "POST",
        BODY: new RegExp("(?:^passphrase=\\w+&ttl=\\d+&recipient=\\w+$)"),
        BODY_REQUIRED: false,
        RESPONSE: new Response({secret_key: "generated"}, {ok: true, status: 200})
    },
    {
        // retrieve secret
        PATH_PATTERN: new RegExp(`${[BASE_PATH_REGEX, "secret", "secretKey"].join("/")}`),
        METHOD: "POST",
        BODY: new RegExp("^passphrase=\\w+$"),
        BODY_REQUIRED: false,
        RESPONSE: new Response({value: "secret"}, {ok: true, status: 200})
    },
    {
        // retrieve secret unknown key
        PATH_PATTERN: new RegExp(`${[BASE_PATH_REGEX, "secret", "unknownKey"].join("/")}`),
        METHOD: "POST",
        BODY: new RegExp("^passphrase=\\w+$"),
        BODY_REQUIRED: false,
        RESPONSE: new Response({message: "Unknown secret"}, {ok: false, status: 404, headers: ERROR_RESPONSE_HEADER_JSON})
    },
    {
        // retrieve metadata
        PATH_PATTERN: new RegExp(`${[BASE_PATH_REGEX, "private", "mykey"].join("/")}`),
        METHOD: "POST",
        BODY: null,
        RESPONSE: new Response({secret_key: "secret"}, {ok: true, status: 200})
    },
    {
        // retrieve metadata burned secret
        PATH_PATTERN: new RegExp(`${[BASE_PATH_REGEX, 'private', 'myBurnedKey'].join('/')}`),
        METHOD: 'POST',
        BODY: null,
        RESPONSE: new Response({metadata_key: 'metadata'}, {ok: true, status: 200})
    },
    {
        // burn
        PATH_PATTERN: new RegExp(`${[BASE_PATH_REGEX, "private", "burnKey", "burn"].join("/")}`),
        METHOD: "POST",
        BODY: null,
        RESPONSE: new Response({state: "burned"}, {ok: true, status: 200})
    },
    {
        // recent
        PATH_PATTERN: new RegExp(`${[BASE_PATH_REGEX, "private", "recent"].join("/")}`),
        METHOD: "GET",
        BODY: null,
        RESPONSE: new Response([{metadata_key: 0}], {ok: true, status: 200})
    },
];
const RESPONSE_SERVER_OFFLINE = new Response(
    {status: "offline"},
    {ok: true, status: 200});
const RESPONSE_ERROR_NOT_AUTH = new Response(
    {message: "Not authorized"},
    {
        ok: false,
        status: 404,
        statusText: "Not found",
        headers: ERROR_RESPONSE_HEADER_JSON
    });
const RESPONSE_ERROR_400 = new Response(
    null,
    {
        ok: false,
        status: 400,
        statusText: "Not Found",
        headers: ERROR_RESPONSE_HEADER
    });
const RESPONSE_ERROR_500 = new Response(
    null,
    {
        ok: false,
        status: 500,
        statusText: "internal server error",
        headers: ERROR_RESPONSE_HEADER
    });

function fetch(url, init) {
    return new Promise((resolve, reject) => {
        let request = null;
        for (let i = 0; i < REQUESTS.length; i++) {
            if (REQUESTS[i].PATH_PATTERN.test(url)) {
                request = REQUESTS[i];
                break;
            }
        }

        if (!request) {
            if (url.indexOf(STATUS_OFFLINE_URL) !== -1) {
                resolve(RESPONSE_SERVER_OFFLINE);
            } else if (url.indexOf(ERROR_400_URL) !== -1) {
                resolve(RESPONSE_ERROR_400);
            }
            else if (url.indexOf(ERROR_500_URL) !== -1) {
                resolve(RESPONSE_ERROR_500);
            }

            reject(new Error("url not found"));
        }

        if (init.method !== request.METHOD) {
            resolve(RESPONSE_ERROR_400);
        }
        if (init.headers.get("Authorization") !== OK_AUTH) {
            resolve(RESPONSE_ERROR_NOT_AUTH);
        }
        if (init.headers.get("Accept") !== OK_ACCEPT) {
            resolve(RESPONSE_ERROR_400);
        }
        if (init.headers.get("Content-Type") !== OK_CONTENT_TYPE) {
            resolve(RESPONSE_ERROR_400);
        }
        if (request.BODY) {
            if ((init.body === undefined) && request.BODY_REQUIRED) {
                resolve(RESPONSE_ERROR_400);
            }
            if (init.body && !request.BODY.test(init.body)) {
                resolve(RESPONSE_ERROR_400);
            }
        }

        // Ok, everything passed
        resolve(request.RESPONSE);
    });
}

export {
    Headers,
    Response,
};
export default fetch;
