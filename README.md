# dvori

> dvori is an elegant composable HTTP client for Node.js

[![npm version](http://img.shields.io/npm/v/dvori.svg?style=flat)](https://npmjs.org/package/dvori "View this project on npm")

## Benefits

-   Extremely customizable
-   Composition API
-   Request, Response, and Error Hooks
-   Powerful Middleware

## Simple Example

```js
const { createClient } = require("dvori");

const client = createClient({});
const { status, data } = client.get({ url: "httpbin.org/get" });
```

## Documentation

-   [Install](#install)

## Install

Use the package manager [npm](https://www.npmjs.com/package/dvori) to install dvori.

```js
npm install dvori
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

Apache-2.0
