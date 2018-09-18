[![Build Status](https://travis-ci.org/tgamauf/onetimesecret-api.svg?branch=master)](https://travis-ci.org/tgamauf/onetimesecret-api)

## onetimesecret-api

A thin Javascript wrapper around the [OneTimeSecret API](https://onetimesecret.com/docs/api).

[OneTimeSecret](https://onetimesecret.com) is an open-source secret-sharing service that ensures that secrets can be shared securely and are only read once. The service can be accessed via the [webpage](https://onetimesecret.com), or via API. This project provides a thin Javascript wrapper for the API that makes it easy to use the service or a self-hosted server in any Javascript project. You can find the source code in the [OneTimeSecret Github](https://github.com/onetimesecret/onetimesecret). 

The module is published on NPM as *onetimesecret-api*.

###Dependencies
- Node.js: 8+

###Installation
```bash
yarn add onetimesecret-api
```

or 

```bash
npm install onetimesecret-api
```


###Usage

The API wrapper is implemented for [asynchronous control flow using promises](https://howtonode.org/promises). For most calls the promise resolves into a Javascript object containing all attributes provided by the server. Configuration or server errors are thrown and have to be handled by the caller.   
Only the most important attributes of a call are documented here, please check out the [API description](https://onetimesecret.com/docs/api) for the full documentation.


In addition to the original API calls an additional call *shareLink* is provided that returns the share link of a new secret directly.

In order to use the API the API class must be imported and setup to get a handler.

```
OneTimeSecretApi(<username>, <api_key>, [<options>])
```

- `<username>`: username specified during sign-up at the [OneTimeSecret Service](https://onetimesecret.com), or your server of choice (if defined in the <options>)
- `<api_key>`: API key created for your account
- `<options>`: additional api options
    - `<url>`: server url of a custom server
    - `<api_version>`: API version to use (currently only "v1")

Example:
    
```javascript 1.6
const OneTimeSecretApi = require('onetimesecret-api');
const ots = new OneTimeSecretApi("tom@example.com", "04821d62");
```
or
```javascript 1.6
const OneTimeSecretApi = require('onetimesecret-api');
const ots = new OneTimeSecretApi(
    "tom@example.com",
    "04821d62",
    { url: "https://www.my-ots-server.com", apiVersion: "v1" });
```
    
####Status

Request the server status as boolean.

```
status() -> boolean
```

Example:
```javascript 1.6
ots.status()
.then((status) => {
    console.log(`Status: ${status}`);
})
catch((error) => {
    console.error(`Error: ${error}`);
});
```

####Share

Encrypt and share a secret.

```
share(<secret>, [<options>]) -> object
```

- `<secret>`: the secret to share (depending on your account type 1k to 10k length)
- `<options>`: additional api options
    - `<passphrase>`: passphrase that will be required to read the secret
    - `<ttl>`: time in seconds after which the secret will be automatically be deleted ("burned")
    - `<recipient>`: email address of the person the secret should be sent to by the server

The returned object contains all of the metadata of the newly created secret. Important values:
- `secret_key`: the secret key that is used to **share** the secret
- `metadata_key`: key used to manage the secret; this key must remain **private**

# TODO