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

const client = createClient();
const { status, data } = client.get({ url: "httpbin.org/get" });
```

## Documentation

-   [Install](#install)
-   [Basic Concepts](#basic-concepts)
-   [Why](#why)
-   [Create Client](#create-client)
-   [Compose Plugins](#compose-plugins)
-   [Compose Middleware](#compose-middleware)
-   [API](#api)
-   [Contributing](#contributing)
-   [License](#license)

## Install

Use the package manager [npm](https://www.npmjs.com/package/dvori) to install dvori.

```js
npm install dvori
```

## Basic Concepts

dvori is really just a collection of functions that when used together with the power of functional composition simplify the task of creating complex API clients.

For example, what if you want to fetch data from two third party API's. Let's use Twitter and Reddit for this example. If you want to write an API client that can easily fetch both of these API's your code will likely end up with a lot of conditionals, shared code, and custom code to handle the intricacies of both.

Here are just a few problems you'd have to overcome:

-   Authentication: Twitter uses OAuth1 and Reddit uses OAuth2
-   Rate Limiting: Both have different rate limits that you can't exceed
-   Pagination: Both handle pagination differently
-   Parsing the response: Both send back JSON in different formats

dvori makes this task a lot simpler by allowing you to use the [plugin](#compose-plugins) or [middleware](#compose-middleware) that you need to create a client. You could easily create separate clients for Twitter and Reddit.

## Create Client

```js
const { createClient } = require("dvori");
const client = createClient();
```

## Compose Plugins

### Creating Plugins

`composePlugins(...plugins)`

Plugins allow you to hook into specific points of the clients request / response / error lifecycle.

1. Hook `onRequest(config)`:

`onRequest: config => config`

2. Hook `onResponse(response)`:

`onResponse: response => response;`

3. Hook `onError(err)`:

`onResponse: err => err;`

### Example:

```js
const { createClient, composePlugins } = require("dvori");

const addHeader = ({ key, val }) => ({
	onRequest: config => {
		config.headers[key] = val;
		return config;
	}
});

// composePlugin accepts multiple plugins and composes them into one function
const onReqHandler = composePlugins(addHeader("Content-Type", "application/json"));

const client = createClient({
	plugins: {
		onRequest: onReqHandler
	}
});
```

## Compose Middleware

> Ogres & middleware are like onions, they both have layers

### Built in Middleware

-   `pagination()`
-   `OAuth1()`
-   `OAuth2()`

### Example:

```js
const { createClient, composeMiddleware } = require("dvori");

const myMiddleware = next => async config => {
	// You can modify the config here
	let response = await next(config);
	// You can modify the response here
	return response;
};

const client = createClient({
	middleware: composeMiddleware(myMiddleware)
});
```

## API

---

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

Apache-2.0
