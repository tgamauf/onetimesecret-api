import {Buffer} from "buffer";

const OK_USER = "ok_user";
const OK_API_KEY = "ok_api_key";
const OK_API_VERSION = "v1";
const OK_URL = "ok_url";
const STATUS_OFFLINE_URL = "status_offline_url";
const ERROR_400_URL = "error_400_url";
const ERROR_500_URL = "error_500_url";
const OK_AUTH = "Basic " + Buffer.from(OK_USER + ":" + OK_API_KEY).toString("base64");
const OK_ACCEPT = "application/json";
const OK_CONTENT_TYPE = "application/x-www-form-urlencoded";

class Headers {
    private readonly data: object;

    public constructor() {
        this.data = {};
    }

   public append(key, value) {
        this.data[key] = value;
    }

    public get(key) {
        return this.data[key];
    }
}

class Response {
    private readonly body: any;
    private ok: boolean;
    private status: number;
    private statusText: string;
    private headers: Headers;

    constructor(body, init) {
        this.body = body;
        this.ok = init.ok;
        this.status = init.status;
        this.statusText = init.statusText;
        this.headers = init.headers;
    }

    public json() {
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
        BODY: null,
        METHOD: "GET",
        PATH_PATTERN: new RegExp(`${[BASE_PATH_REGEX, "status"].join("/")}`),
        RESPONSE: new Response({status: "nominal"}, {ok: true, status: 200}),
    },
    {
        // share
        BODY: new RegExp("(?:^secret=\\w+$)|(?:^secret=\\w+&passphrase=\\w+&ttl=\\d+&recipient=\\w+$)"),
        BODY_REQUIRED: true,
        METHOD: "POST",
        PATH_PATTERN: new RegExp(`${[BASE_PATH_REGEX, "share"].join("/")}`),
        RESPONSE: new Response({secret_key: "test"}, {ok: true, status: 200}),
    },
    {
        // generate
        BODY: new RegExp("(?:^passphrase=\\w+&ttl=\\d+&recipient=\\w+$)"),
        BODY_REQUIRED: false,
        METHOD: "POST",
        PATH_PATTERN: new RegExp(`${[BASE_PATH_REGEX, "generate"].join("/")}`),
        RESPONSE: new Response({secret_key: "generated"}, {ok: true, status: 200}),
    },
    {
        // retrieve secret
        BODY: new RegExp("^passphrase=\\w+$"),
        BODY_REQUIRED: false,
        METHOD: "POST",
        PATH_PATTERN: new RegExp(`${[BASE_PATH_REGEX, "secret", "secretKey"].join("/")}`),
        RESPONSE: new Response({value: "secret"}, {ok: true, status: 200}),
    },
    {
        // retrieve secret unknown key
        BODY: new RegExp("^passphrase=\\w+$"),
        BODY_REQUIRED: false,
        METHOD: "POST",
        PATH_PATTERN: new RegExp(`${[BASE_PATH_REGEX, "secret", "unknownKey"].join("/")}`),
        RESPONSE: new Response({message: "Unknown secret"}, {
            headers: ERROR_RESPONSE_HEADER_JSON,
            ok: false,
            status: 404,
        }),
    },
    {
        // retrieve metadata
        BODY: null,
        METHOD: "POST",
        PATH_PATTERN: new RegExp(`${[BASE_PATH_REGEX, "private", "mykey"].join("/")}`),
        RESPONSE: new Response({secret_key: "secret"}, {ok: true, status: 200}),
    },
    {
        // retrieve metadata burned secret
        BODY: null,
        METHOD: "POST",
        PATH_PATTERN: new RegExp(`${[BASE_PATH_REGEX, "private", "myBurnedKey"].join("/")}`),
        RESPONSE: new Response({metadata_key: "metadata"}, {ok: true, status: 200}),
    },
    {
        // burn
        BODY: null,
        METHOD: "POST",
        PATH_PATTERN: new RegExp(`${[BASE_PATH_REGEX, "private", "burnKey", "burn"].join("/")}`),
        RESPONSE: new Response({state: "burned"}, {ok: true, status: 200}),
    },
    {
        // recent
        BODY: null,
        METHOD: "GET",
        PATH_PATTERN: new RegExp(`${[BASE_PATH_REGEX, "private", "recent"].join("/")}`),
        RESPONSE: new Response([{metadata_key: 0}], {ok: true, status: 200}),
    },
];
const RESPONSE_SERVER_OFFLINE = new Response(
    {status: "offline"},
    {ok: true, status: 200});
const RESPONSE_ERROR_NOT_AUTH = new Response(
    {message: "Not authorized"},
    {
        headers: ERROR_RESPONSE_HEADER_JSON,
        ok: false,
        status: 404,
        statusText: "Not found",
    });
const RESPONSE_ERROR_400 = new Response(
    null,
    {
        headers: ERROR_RESPONSE_HEADER,
        ok: false,
        status: 400,
        statusText: "Not Found",
    });
const RESPONSE_ERROR_500 = new Response(
    null,
    {
        headers: ERROR_RESPONSE_HEADER,
        ok: false,
        status: 500,
        statusText: "internal server error",
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

            } else if (url.indexOf(ERROR_500_URL) !== -1) {
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
    fetch,
    Headers,
    Response,
};
export default fetch;
