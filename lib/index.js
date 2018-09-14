import {Buffer} from "buffer";

const DEFAULT_API_VERSION = "v1";
const DEFAULT_URL = "https://onetimesecret.com/";
const API_PATH = "api";
const FETCH_TIMEOUT = 30;


function url_encode_dict(data) {
    /*
    Join up the parameters in the dict to conform to
    application/x-www-form-urlencoded encoding.

    Parameter:
        data: dictionary of parameters

    Returns: encoded data
    */

    let parameters = [];
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            let value = data[key];
            let parameter = [key, value].join("=");
            parameters.push(parameter);
        }
    }

    return parameters.join("&");
}

async function fetchWithTimeout(url, init = null, timeout = null) {
    /*
    Execute a request using the fetch API and raise an exception if an timeout
    occured.

    Parameter:
        callback: function to execute if
        url: request url - passed to fetch
        init: options object - passed to fetch; default: null
        timeout: timeout of the request; default: null
     */

    return new Promise(function (resolve, reject) {
        let did_time_out = false;

        const timeout = setTimeout(function () {
                did_time_out = true;

                reject(new Error("Request timed out"));
            },
            timeout);

        fetch(url, init)
            .then((response) => {
                // Clear the timeout as cleanup
                clearTimeout(timeout);

                if (!did_time_out) {
                    console.debug("Fetch ok");

                    resolve(response);
                }
            })
            .catch((error) => {
                console.log("Fetch failed");

                // Rejection already happened with setTimeout
                if (did_time_out) return;

                reject(error);
            });
    });
}


class ApiRequest {
    constructor(username, api_key, api_version, url) {
        /*
        Create a OTS API request.

        Parameter:
            username: your OTS password
            api_key: the API key of your OTS account
            api_version: API version to use
            url: OTS server url
         */

        console.debug(`${this.constructor.name} username=${username}, api_key=${api_key}, api_key=${api_key}, api_version=${api_version}, url=${url}`);

        let authorization = "Basic " + Buffer.from(username + ":" + api_key)
            .toString("base64");

        this.headers = new Headers();
        this.headers.append("Authorization", authorization);
        this.headers.append("Accept", "application/json");
        this.headers.append("Content-Type", "application/x-www-form-urlencoded");

        this.api_url = [url, API_PATH, api_version].join("/");

        // Must be defined in derived class
        this.PATH = null;
        this.method = null;
        this.body = null;
    }

    prepare() {
        /*
        Prepare an api request.

        Returns: array of format [url, init]
        */

        console.debug(`${this.constructor.name} prepare`);

        // this.PATH, this.method, and this.body must be set in derived class
        if (!this.PATH)
            throw Error(`PATH not set for request '${this.constructor.name}'`);
        if (!this.method)
            throw Error(`method not set for request '${this.constructor.name}'`);
        if (!this.body)
            throw Error(`body not set for request '${this.constructor.name}'`);


        let url = [this.api_url, this.PATH].join("/");
        let init = {
            method: this.method,
            headers: this.headers,
            body: this.body
        };

        console.debug(`Method: ${this.method}`);
        console.debug(`Headers: ${this.headers}`);
        console.debug(`Body: ${this.body}`);
        console.debug(`Url: ${url}`);

        return [url, init];
    }

    async send_sync(timeout=FETCH_TIMEOUT) {
        /*
        Send the request to the server and wait for the result.

        Returns: processed response object

        Raises: on failed request or timeout
        */

        console.debug(`${this.constructor.name} send_sync timeout=${timeout}`);

        let prepared = this.prepare();
        let url = prepared[0];
        let init = prepared[1];

        let response = null;
        try {
            response = await fetchWithTimeout(url, init, timeout);
        }
        catch(error) {
            throw Error(`${this.constructor.name} failed with status: ${response.status}`);
        }

        return this.process(response);
    }

    send_async(callback, timeout=FETCH_TIMEOUT) {
        /*
        Send the request to the server and call callback with response.

        Raises: on failed request or timeout
        */

        console.debug(`${this.constructor.name} send_async timeout=${timeout}`);

        let prepared = this.prepare();
        let url = prepared[0];
        let init = prepared[1];

        fetchWithTimeout(url, init, timeout)
            .then(response => {
                if (response.ok) {
                    return response
                } else {
                    console.debug(`Response: ${response}`);

                    throw Error(`${this.constructor.name} failed with status: ${response.status}`);
                }
            })
            .then((response) => response.json())
            .then((response) => {
                console.debug(`Response: ${response}`);

                this.process(callback, response);
            })
            .catch(function (error) {
                throw Error(`Request failed with error: ${error}`);
            });
    }

    process(response, callback=null) {
        /*
        Process the api request and call the callback if defined.

        Parameter:
            response: response object received from the request
            callback: callback called when server response is received;
                default: null

        Returns: processed reponse object if callback not defined, or null
            otherwise
        */

        console.debug(`${this.constructor.name} process`);

        if (callback)
            callback(response);
        else
            return response;
    }
}

class ApiRequestStatus extends ApiRequest {
    /* Check server status. */

    constructor(username, api_key, api_version, url) {
        super(username, api_key, api_version, url);

        this.PATH = "status";
        this.method = "GET";
        this.body = null;
    }

    process(response, callback=null) {
        console.debug(`${this.constructor.name} process`);

        let is_available = false;
        if (response.status === "nominal")
            is_available = true;

        if (callback)
            callback(is_available);
        else
            return is_available;
    }
}

class ApiRequestShare extends ApiRequest {
    constructor(username,
                api_key,
                api_version,
                url,
                secret,
                passphrase,
                ttl,
                recipient) {
        /* Send text to server for sharing. */

        super(username, api_key, api_version, url);

        console.debug(`${this.constructor.name} secret=${secret}, passphrase=${passphrase}, ttl=${ttl}, recipient=${recipient}`);

        let data = {
            secret: secret,
            passphrase: passphrase,
            ttl: ttl,
            recipient: recipient
        };

        this.PATH = "share";
        this.method = "POST";
        this.body = url_encode_dict(data);
    }
}

class ApiRequestGenerate extends ApiRequest {
    constructor(username,
                api_key,
                api_version,
                url,
                passphrase,
                ttl,
                recipient) {
        /* Request a short, unique secret for sharing. */

        super(username, api_key, api_version, url);

        console.debug(`${this.constructor.name} passphrase=${passphrase}, ttl=${ttl}, recipient=${recipient}`);

        let data = {
            passphrase: passphrase,
            ttl: ttl,
            recipient: recipient
        };

        this.PATH = "generate";
        this.method = "POST";
        this.body = url_encode_dict(data);
    }
}

class ApiRequestRetrieveSecret extends ApiRequest {
    constructor(username, api_key, api_version, url, secret_key, passphrase) {
        /* Retrieve a secret. */

        super(username, api_key, api_version, url);

        console.debug(`${this.constructor.name} secret_key=${secret}, passphrase=${passphrase}`);

        let data = {
            secret_key: secret_key,
            passphrase: passphrase
        };

        this.PATH = ["secret", secret_key].join("/");
        this.method = "GET";
        this.body = url_encode_dict(data);
    }
}

class ApiRequestRetrieveMetadata extends ApiRequest {
    constructor(username, api_key, api_version, url, metadata_key) {
        /* Retrieve a secret. */

        super(username, api_key, api_version, url);

        console.debug(`${this.constructor.name} metadata_key=${metadata_key}`);

        let data = {
            metadata_key: metadata_key
        };

        this.PATH = ["private", metadata_key].join("/");
        this.method = "GET";
        this.body = url_encode_dict(data);
    }
}

class ApiRequestBurn extends ApiRequest {
    constructor(username, api_key, api_version, url, metadata_key) {
        /* Burn a secret. */

        super(username, api_key, api_version, url);

        console.debug(`${this.constructor.name} metadata_key=${metadata_key}`);

        this.PATH = ["secret", metadata_key, "burn"].join("/");
        this.method = "POST";
    }
}

class ApiRequestRecentMetadata extends ApiRequest {
    constructor(username, api_key, api_version, url) {
        /* Fetch secret metadata from the server. */

        super(username, api_key, api_version, url, metadata_key);

        console.debug(`${this.constructor.name}`);

        this.PATH = "private/recent";
        this.method = "GET";
    }
}

class OneTimeSecret {
    constructor(username, api_key, api_version = null, url = null) {
        /*
        Create object for interaction with OTS.

        Parameter:
            username: your OTS password
            api_key: the API key of your OTS account
            api_version: API version to use; default: v1
            url: OTS server url; default: https://onetimesecret.com/
         */

        this.username = username;
        this.api_key = api_key;

        if (api_version)
            this.api_version = api_version;
        else
            this.api_version = DEFAULT_API_VERSION;

        if (url)
            this.url = url;
        else
            this.url = DEFAULT_URL;
    }

    _send(request, callback) {
        /*
        Send API request.

        Parameters:
            request: api request object derived from the ApiReqeust class
            callback: function that is called with the response object as
                parameter

        Returns: null or response object if callback is null

        Raises: connection/request errors
        */

        try {
            if (callback) {
                request.send_async(callback);
            }
            else {
                let response = request.send_sync();

                console.debug(`Server returned ${response}`);
            }
        }
        catch(error) {
            console.error(`${request.constructor.name} to server ${this.url} failed with error: ${error}`);
        }
    }

    status(callback=null) {
        /*
        Request the server status.
        If callback is specified the callback is called with the boolean status.

        Parameter:
            callback: callback to execute with the server status as parameter

        Returns: true if server is available and the callback isn't defined,
            else returns null
        */

        let status = null;

        try {
            let request = ApiRequestStatus(
                this.username,
                this.api_key,
                this.api_version,
                this.url);

            let response = this._send(request, callback);

            if (response) {
                status = response.status === "nominal";
            }
        }
        catch(error) {
            if (callback)
                throw error;
            else
                status = false;
        }

        console.debug(`Server status of ${this.url} is ${status}`);

        return status;
    }

    share(secret, passphrase=null, ttl=null, recipient=null, callback=null) {
        /*
        Share a secret.
        If a callback is specified it is called with the response object.

        The response object is a dictionary that contains at least the following
        keys:
            - metadata_key: private, unique key of the secret used for secret
                management
            - secret_key: unique key of the created secret, which is meant for
                sharing
        Please check the API description for the other available keys:
        https://onetimesecret.com/docs/api/secrets

        Parameter:
            secret: the secret value to encrypt and share (max. 1k-10k  length
                depending on your account)
            passphrase: string the recipent must know to view the secret
            ttl: time after which the secret will be burned automatically
            recipient: email adress the secret will be sent to
            callback: callback to execute with the response object as parameter

        Raises: connection/request errors

        Returns: response object if the callback isn't defined, or null
        */

        console.debug(`${this.constructor.name} secret=${secret}, passphrase=${passphrase}, ttl=${ttl}, recipient=${recipient}`);

        let response = null;

        if (this.status()) {
            let request = ApiRequestShare(
                this.username,
                this.api_key,
                this.api_version,
                this.url,
                secret,
                passphrase,
                ttl,
                recipient);

            response = this._send(request, callback);
        }

        return response;
    }

    _create_secret_url(secret_key) {
        /* Create the secret link from the secret. */

        return [this.url, secret_key].join("/");
    }

    share_link(secret,
               passphrase=null,
               ttl=null,
               recipient=null,
               callback=null) {
        /*
        Share a secret and get the link.
        If a callback is specified it is called with the secret link.

        Parameter:
            secret: the secret value to encrypt and share (max. 1k-10k  length
                depending on your account)
            passphrase: string the recipent must know to view the secret
            ttl: time after which the secret will be burned automatically
            recipient: email adress the secret will be sent to
            callback: callback to execute with the response object as parameter

        Raises: connection/request errors

        Returns: response object, or null
        */

        console.debug(`${this.constructor.name} secret=${secret}, passphrase=${passphrase}, ttl=${ttl}, recipient=${recipient}`);

        let secret_link = null;

        if (this.status()) {
            let request = ApiRequestShare(
                this.username,
                this.api_key,
                this.api_version,
                this.url,
                secret,
                passphrase,
                ttl,
                recipient);

            let response = this._send(request, callback);

            secret_link = this._create_secret_url(response.secret_key);
        }

        return secret_link;
    }

    generate(passphrase=null, ttl=null, recipient=null, callback=null) {
        /*
        Generate a short, unique secret.
        If a callback is specified it is called with the response object.

        The response object is a dictionary that contains at least the following
        keys:
            - metadata_key: private, unique key of the secret used for secret
                management
            - secret_key: unique key of the created secret, which is meant for
                sharing
            - value: generated secret
        Please check the API description for the other available keys:
        https://onetimesecret.com/docs/api/secrets

        Parameter:
            passphrase: string the recipent must know to view the secret
            ttl: time after which the secret will be burned automatically
            recipient: email adress the secret will be sent to
            callback: callback to execute with the server status as parameter

        Raises: connection/request errors

        Returns: response object if the callback isn't defined, or null
        */

        console.debug(`${this.constructor.name} passphrase=${passphrase}, ttl=${ttl}, recipient=${recipient}`);

        let response = null;

        if (this.status()) {
            let request = ApiRequestGenerate(
                this.username,
                this.api_key,
                this.api_version,
                this.url,
                passphrase,
                ttl,
                recipient);

            response = this._send(request, callback);
        }

        return response;
    }

    retrieve_secret(secret_key, passphrase=null, callback=null) {
        /*
        Retrieve the secret specified by the key.
        If a callback is specified it is called with the response object.

        The response object is a dictionary that contains at least the following
        keys:
            - value: retrieved secret
        Please check the API description for the other available keys:
        https://onetimesecret.com/docs/api/secrets

        Parameter:
            secret_key: secret key of the secret
            passphrase: string the recipent must know to view the secret
            callback: callback to execute with the server status as parameter

        Raises: connection/request errors

        Returns: response object if the callback isn't defined, or null
        */

        console.debug(`${this.constructor.name} secret_key=${secret_key}, passphrase=${passphrase}`);

        let response = null;

        if (this.status()) {
            let request = ApiRequestRetrieveSecret(
                this.username,
                this.api_key,
                this.api_version,
                this.url,
                secret_key,
                passphrase);

            response = this._send(request, callback);
        }

        return response;
    }

    retrieve_metadata(metadata_key, callback=null) {
        /*
        Retrieve the metadata of the secret specified by the key.
        If a callback is specified it is called with the response object.

        The response object is a dictionary that contains at least the following
        keys:
            - secret_key: unique key of the created secret, which is meant for
                sharing
            - secret_ttl: time in seconds the secret has left to live
            - status: status of the secret - one of ["new", "received", "burned"]
            - received: time the secret was received
        Please check the API description for the other available keys:
        https://onetimesecret.com/docs/api/secrets

        Parameter:
            metadata_key: private, unique key of the secret used for secret
                management
            callback: callback to execute with the server status as parameter

        Raises: connection/request errors

        Returns: response object if the callback isn't defined, or null
        */

        console.debug(`${this.constructor.name} passphrase=${metadata_key}`);

        let response = null;

        if (this.status()) {
            let request = ApiRequestRetrieveMetadata(
                this.username,
                this.api_key,
                this.api_version,
                this.url,
                metadata_key);

            response = this._send(request, callback);
        }

        return response;
    }

    burn(metadata_key, callback=null) {
        /*
        Retrieve the metadata of the secret specified by the key.
        If a callback is specified it is called with the response object.

        The response object is a dictionary that contains at least the following
        keys:
            - secret_key: unique key of the created secret, which is meant for
                sharing
            - secret_ttl: time in seconds the secret has left to live
            - status: status of the secret set to "burned"
        Please check the API description for the other available keys:
        https://onetimesecret.com/docs/api/secrets

        Parameter:
            metadata_key: private, unique key of the secret used for secret
                management
            callback: callback to execute with the server status as parameter

        Raises: connection/request errors

        Returns: response object if the callback isn't defined, or null
        */

        console.debug(`${this.constructor.name} metadata_key=${metadata_key}`);

        let response = null;

        if (this.status()) {
            let request = ApiRequestRetrieveMetadata(
                this.username,
                this.api_key,
                this.api_version,
                this.url,
                metadata_key);

            response = this._send(request, callback);
        }

        return response;
    }

    retrieve_recent_metadata(callback=null) {
        /*
        Retrieve a list of recent metadata.
        If a callback is specified it is called with the response object.

        The response object is a list of dictionaries that contains at least the
        following keys:
            - metadata_key: private, unique key of the secret used for secret
                management
            - secret_key: the secret key, but SET TO NULL
        Please check the API description for the other available keys:
        https://onetimesecret.com/docs/api/secrets

        Parameter:
            metadata_key: private, unique key of the secret used for secret
                management
            callback: callback to execute with the server status as parameter

        Raises: connection/request errors

        Returns: response object if the callback isn't defined, or null
        */

        console.debug(`${this.constructor.name}`);

        let response = null;

        if (this.status()) {
            let request = ApiRequestRecentMetadata(
                this.username,
                this.api_key,
                this.api_version,
                this.url);

            response = this._send(request, callback);
        }

        return response;
    }
}

export default OneTimeSecret;