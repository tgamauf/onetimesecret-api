[![npm version](https://badge.fury.io/js/onetimesecret-api.svg)](https://badge.fury.io/js/onetimesecret-api) [![Build Status](https://travis-ci.org/tgamauf/onetimesecret-api.svg?branch=master)](https://travis-ci.org/tgamauf/onetimesecret-api)

## onetimesecret-api
A thin Javascript wrapper around the [OneTimeSecret API](https://onetimesecret.com/docs/api).

[OneTimeSecret](https://onetimesecret.com) is an open-source secret-sharing service that ensures that secrets can be shared securely and are only read once. The service can be accessed via the [webpage](https://onetimesecret.com), or via API. This project provides a thin Javascript wrapper for the API that makes it easy to use the service or a self-hosted server in any Javascript project. You can find the source code in the [OneTimeSecret Github](https://github.com/onetimesecret/onetimesecret). 

The module is published on NPM as *onetimesecret-api*.

### Dependencies
- Node.js: 8+

### Installation
```bash
yarn add onetimesecret-api
```

or 

```bash
npm install onetimesecret-api
```


### Usage
The API wrapper is implemented for [asynchronous control flow using promises](https://howtonode.org/promises). For most calls the promise resolves into a Javascript object containing all attributes provided by the server. Configuration or server errors are thrown and have to be handled by the caller.
Only the most important attributes of a call are documented here, please check out the [API description](https://onetimesecret.com/docs/api) for the full documentation.

In order to use the API the API class must be imported and setup to get a handler.


```
OneTimeSecretApi(<username>, <api_key>, [<options>])
```

- `<username>`: username specified during sign-up at the [OneTimeSecret Service](https://onetimesecret.com), or your server of choice (if defined in the `<options>`)
- `<password>`: Password or API key created for your account
- `<options>`: additional api options
    - `<url>`: server url of a custom server
    - `<apiVersion>`: API version to use (currently only "v1"). `ApiVersion` provides a list of supported API versions
- Returns instance of the API
- Throws `InputError` if `<username>` or `<password>` is missing

Example:
    
```javascript 1.6
import {OneTimeSecretApi} from "onetimesecret-api";

const ots = new OneTimeSecretApi("tom@example.com", "04821d62");
```
or
```javascript 1.6
import {OneTimeSecretApi} from "onetimesecret-api";

const ots = new OneTimeSecretApi(
    "tom@example.com",
    "04821d62",
    { url: "https://www.my-ots-server.com", apiVersion: "v1" });
```
or
```javascript 1.6
import {InputError, OneTimeSecretApi} from "onetimesecret-api";

try {
    const ots = new OneTimeSecretApi();
} catch(error) {
    if (error instanceof InputError) {
        console.error("Username or password missing");
    } else {
        console.error(`Unknown error: ${error}`);
    }
}

```
    
#### Status
Request the server status as boolean.

```
status() -> boolean
```
- Returns boolean state of server
- Throws
    - `InternalServerError`: unspecified internal server error
    - `TimeoutError`: request timeout
    - `NotAuthorizedError`: invalid username or password
    - `RateLimitedError`: account has been rate limited due to many requests

Example:
```javascript 1.6
ots.status()
.then((status) => {
    console.log(`Status: ${status}`);
})
.catch((error) => {
    console.error(`Error: ${error}`);
});
```

#### Share
Encrypt and share a secret.

```
share(<secret>, [<options>]) -> object
```

- `<secret>`: the secret to share (depending on your account type 1k to 10k length)
- `<options>`: additional api options of type `ApiOptionsShare`
    - `<passphrase>`: passphrase that will be required to read the secret
    - `<ttl>`: time in seconds after which the secret will be automatically be deleted ("burned")
    - `<recipient>`: email address of the person the secret should be sent to by the server
- Returns a promise that provides an `ApiResponseShare` object. The returned object contains all of the metadata of the newly created secret. Important values:
    - `secret_key`: the secret key that is used to **share** the secret
    - `share_link`: the share link of the secret that is supposed to be be shared
    - `metadata_key`: key used to manage the secret; this key must remain **private**
- Throws
    - `InputError`: no secret provided
    - `InternalServerError`: unspecified internal server error
    - `FetchError`: fetch call failed
    - `NotFoundError`: the call isn't supported by the server
    - `TimeoutError`: request timeout
    - `NotAuthorizedError`: invalid username or password
    - `RateLimitedError`: account has been rate limited due to many requests

Examples:
```javascript 1.6
ots.share('My very special secret')
.then((response) => {
    console.log(`Secret key: ${response.secret_key}`);
})
catch((error) => {
    console.error(`Error: ${error}`);
});
```
or
```javascript 1.6
ots.share('My very special secret', { ttl: 3600 })
.then((response) => {
    console.log(`Secret key: ${response.secret_key}`);
})
.catch((error) => {
    console.error(`Error: ${error}`);
});
```

#### Generate
Generate a short, encrypted secret and share it.

```
generate([<options>]) -> object
```

- `<options>`: additional api options of type `ApiOptionsGenerate`
    - `<passphrase>`: passphrase that will be required to read the secret
    - `<ttl>`: time in seconds after which the secret will be automatically be deleted ("burned")
    - `<recipient>`: email address of the person the secret should be sent to by the server
- Returns a promise that provides an `ApiResponseGenerate` object. The returned object contains all of the metadata of the newly created secret. Important values:
    - `secret_key`: the secret key that is used to **share** the secret
    - `share_link`: the share link of the secret that is supposed to be be shared
    - `metadata_key`: key used to manage the secret; this key must remain **private**
- Throws
    - `InternalServerError`: unspecified internal server error
    - `FetchError`: fetch call failed
    - `TimeoutError`: request timeout
    - `NotFoundError`: the call isn't supported by the server
    - `NotAuthorizedError`: invalid username or password
    - `RateLimitedError`: account has been rate limited due to many requests
    
Example:
```javascript 1.6
ots.generate()
.then((response) => {
    console.log(`Secret key: ${response.secret_key}`);
})
.catch((error) => {
    console.error(`Error: ${error}`);
});
```


#### Retrieve secret
Retrieve a secret from the server. This call is used to get a secret someone else shared with you. If the secret was shared with a passphrase it has to be provided to the call in the options.

```
retrieveSecret(secret_key, [<options>]) -> object
```

- `<secret_key>`: secret key that was shared with you
- `<options>`: additional api options of type `ApiOptionsRetrieveSecret`
    - `<passphrase>`: passphrase that will be required to read the secret
- Returns a promise that provides an `ApiResponseRetrieveSecret` object. The returned object contains all the information of the secret you can access. Important values:
    - `value`: the secret shared with you
- Throws
    - `InputError`: no secret key provided
    - `InternalServerError`: unspecified internal server error
    - `FetchError`: fetch call failed
    - `NotFoundError`: the call isn't supported by the server
    - `UnknownSecretError`: secret key not found
    - `TimeoutError`: request timeout
    - `NotAuthorizedError`: invalid username or password
    - `RateLimitedError`: account has been rate limited due to many requests

Example:
```javascript 1.6
ots.retrieveSecret('hbo11uxhmg2gze0mlcmyf4x0qahawqa')
.then((response) => {
    console.log(`Secret value: ${response.value}`);
})
.catch((error) => {
    console.error(`Error: ${error}`);
});
```


#### Retrieve metadata
Retrieve metadata for a secret you created.

```
retrieveMetadata(metadata_key) -> object
```

- `<metadata_key>`: metadata key that was shared with you
- Returns a promise that provides an `ApiResponseRetrieveMetadata` object. The returned object contains all of the metadata of the newly created secret. Important values:
    - `secret_key`: the secret key that is used to **share** the secret
    - `share_link`: the share link of the secret that is supposed to be be shared
    - `status`: status of the secret, e.g. "new", "received", "burned", "viewed", ... 
- Throws
    - `InputError`: no metadata key provided
    - `InternalServerError`: unspecified internal server error
    - `FetchError`: fetch call failed
    - `NotFoundError`: the call isn't supported by the server
    - `UnknownSecretError`: metadata key not found
    - `TimeoutError`: request timeout
    - `NotAuthorizedError`: invalid username or password
    - `RateLimitedError`: account has been rate limited due to many requests

Example:
```javascript 1.6
ots.retrieveMetadata('hbo11uxhmg2gze0mlcmyf4x0qahawqa')
.then((response) => {
    console.log(`Status: ${response.status}`);
})
.catch((error) => {
    console.error(`Error: ${error}`);
});
```


#### Burn secret
Destroy a secret you created.

```
burn(metadata_key) -> object
```

- `<metadata_key>`: metadata key that was shared with you
- Returns a promise that provides an `ApiResponseBurn` object. The returned object contains all of the metadata of the newly created secret. Important values:
    - `secret_key`: the secret key that is used to **share** the secret
    - `status`: status of the secret set to "burned"
- Throws
    - `InputError`: no metadata key provided
    - `InternalServerError`: unspecified internal server error
    - `FetchError`: fetch call failed
    - `NotFoundError`: the call isn't supported by the server
    - `UnknownSecretError`: metadata key not found
    - `TimeoutError`: request timeout
    - `NotAuthorizedError`: invalid username or password
    - `RateLimitedError`: account has been rate limited due to many requests

Example:
```javascript 1.6
ots.burn('raldp8yshsh42hyse')
.then((response) => {
    console.log(`Status: ${response.status}`);
})
.catch((error) => {
    console.error(`Error: ${error}`);
});
```


#### Retrieve recent secrets
Retrieve all recently created secrets and *most* of its metadata.

```
recentMetadata() -> Array[object]
```

- Returns a promise that provides an `ApiResponseRecentMetadata` object. The returned object contains a list if objects where each object represents a secret. It has a subset of attributes as described for `retrieve_metadata`.
- Throws
    - `InternalServerError`: unspecified internal server error
    - `FetchError`: fetch call failed
    - `NotFoundError`: the call isn't supported by the server
    - `TimeoutError`: request timeout
    - `NotAuthorizedError`: invalid username or password
    - `RateLimitedError`: account has been rate limited due to many requests

Example:
```javascript 1.6
ots.recentMetadata()
.then((response) => {
    console.log(`Secret 0 state: ${response[0].state}`);
})
.catch((error) => {
    console.error(`Error: ${error}`);
});
```
