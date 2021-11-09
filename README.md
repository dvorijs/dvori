<p align="center">
  <img
    width="433"
    src="https://raw.githubusercontent.com/imns/dvori/master/img/dvori-logo@2x.png"
    alt="Dvori - HTTP cLient for Node.js"
  />
</p>

<p align="center">
  <a href="https://imns.co/projects/dvori">Website</a>
  ·
  <a href="#Install">Installation</a>
  ·
  <a href="#guide">Configuration</a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/dvori" title="View this project on npm">
  	<img src="http://img.shields.io/npm/v/dvori.svg?style=flat)](https://npmjs.org/package/dvori" alt="npm version" />
  </a>

  <a href="https://opensource.org/licenses/MPL-2.0" title="License">
  	<img src="https://img.shields.io/npm/l/dvori" alt="License" />
  </a>

</p>

## Benefits

-   Composition API
-   Extremely customizable
-   Plugins and Middlewares systems give you total control

## Simple Example

```js
const { createClient } = require("dvori");

const client = createClient();
const { status, data } = await client.get({
	url: "https://www.reddit.com/r/sausagetalk/new.json",
});

console.log(data);
```

## Documentation

-   [Install](#install)
-   [Why](#why)
-   [Guide](#guide)
    -   [Basic Concepts](#basic-concepts)
    -   [Making requests](#making-requests)
    -   [Plugins](#plugins)
    -   [Middleware](#middleware)
-   [API](docs/api/index.md)
    -   [Create Client](docs/api/index.md#create-client)
    -   [Compose Plugins](docs/api/index.md#compose-plugins)
    -   [Compose Middleware](docs/api/index.md#compose-middleware)
-   [Contributing](#contributing)
-   [License](#license)

## Install

Use the package manager [npm](https://www.npmjs.com/package/dvori) to install dvori.

```sh
npm install dvori
```

## Why

We needed a flexible API client that would allow use to make requests to multiple 3rd party API's with vastly different requirements all while not reinventing the wheel for each one. The client needed to be simple and modular, allowing us to write bits of functionality once and reuse them while at the same time not having them be tightly coupled and dependent on each other.

Functional programming and more speficly functional composition gave us the perfect solution to this problem. If you want to see how we did it, continue reading the [guide](#guide) or jump striaght to the [API](#api).

## Guide

Below is a basic walkthrough of dvori's features, taking you from beginner to advanced

### Basic Concepts

At it's core dvori is just a set of functions. You use these functions to create a HTTP client and then use the client to make HTTP requests. It's composition API makes it easy to cleanly build reusable modules.

When you first start to use dvori you will see that it's slightly more verbose than Axios or other HTTP clients. Once you use dvori it becomes clear how powerful it's functional approach is and how quickly it solves complex problems for you.

### Making requests

The first thing you need to do to make a HTTP request is create a HTTP client. The `createClient` function makes this easy.

```js
const { createClient } = require("dvori");
const client = createClient();
```

By default you can use a dvori HTTP client to make request just like you would with other HTTP clients. It supports standard REST verbs `"get", "post", "put", "patch", "delete", "options", "head", "trace"`. Each verb is defined as the property of your client object and is a function that accepts request configs, returning a promise.

```js
const { status, data } = await client.get({
	url: "httpbin.org/get",
});
```

So far this isn't really anything special or different, but once you start using [plugins](#compose-plugins) dvori really starts to shine.

### Plugins

Plugins allow you to hook into specific points of the clients request / response / error lifecycle.

`composePlugins(...plugins)` is a function that takes an array of plugins as arguements. Each plugin is a function that returns an object with at least one of 3 hooks:

1. `onRequest(config)` Hook:

`onRequest: config => config`

```js
const reqPlugin = (options) => {
	return {
		//the onRequest hook gets passed the request config
		onRequest: (config) => {
			/* modify the request config here */

			//the onRequest hook must return the config object
			return config;
		},
	};
};
```

2. `onResponse(response)` Hook:

`onResponse: response => response`

```js
const resPlugin = (options) => {
	return {
		//the onResponse hook gets passed the response object
		onResponse: (response) => {
			/* modify or use the response obj here */

			//the onResponse hook must return the response object
			return response;
		},
	};
};
```

3. `onError(err)` Hook:

`onError: err => err;`

```js
const errPlugin = (options) => {
	return {
		//the onError hook gets passed the error
		onError: (err) => {
			/* do something with the error here. ex: log it */
			console.error(err);
			//the onError hook must return the err object
			return err;
		},
	};
};
```

#### Simple Example:

This creates a custom plugin that adds a header to request before it's sent.

```js
const { createClient, composePlugins } = require("dvori");

const addHeader = (key, val) => ({
	onRequest: (config) => {
		config.headers[key] = val;
		return config;
	},
});

// composePlugin accepts multiple plugins and composes them into one function
const onReqHandler = composePlugins(
	addHeader("Content-Type", "application/json"),
	addHeader("User-Agent", "MyCustomUserAgent:v1")
);

const client = createClient({
	plugins: {
		onRequest: onReqHandler,
	},
});

const response = await client.get({ ...config });
```

Plugins become even more useful if you have multiple API's or API endpoints that have different requirements. Checkout the examples to see how plugins can be mixed and matched to create multiple easy to use API clients.

#### Default Plugins

dvori comes with some useful plugins already written for you.

**Request**

-   `baseUrl`
-   `headers`
-   `userAgent`
-   `params`
-   `data`

**Response**

-   `json`

### Middleware

> Ogres & middleware are like onions, they both have layers

Middleware give you complete control over the request / response lifecycle.

### Example:

```js
const { createClient, composeMiddleware } = require("dvori");

const myMiddleware = (next) => async (config) => {
	// You can modify the config here
	let response = await next(config);
	// You can modify the response here
	return response;
};

const client = createClient({
	middleware: composeMiddleware(myMiddleware),
});
```

#### Default Middleware

-   Retry
-   Pagination
-   OAuth2

---

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests appropriately.

## License

Mozilla Public License 2.0 (MPL-2.0)
