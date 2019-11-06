# dvori

> dvori is an elegant composable HTTP client for Node.js

[![npm version](http://img.shields.io/npm/v/dvori.svg?style=flat)](https://npmjs.org/package/dvori "View this project on npm") ![NPM](https://img.shields.io/npm/l/dvori)

## Benefits

-   Composition API
-   Extremely customizable
-   Plugins allow you to hook into the Request, Response, and Error lifecycle
-   Middlewares give you complete control when you need it

## Simple Example

```js
const { createClient } = require("dvori");

const client = createClient();
```

## Documentation

-   [Install](#install)
-   [Why](#why)
-   [Guide](#guide)
    -   [Basic Concepts](#basic-concepts)
    -   [Making requests](#making-requests)
-   [API](#api)
    -   [Create Client](#create-client)
    -   [Compose Plugins](#compose-plugins)
    -   [Compose Middleware](#compose-middleware)
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

By default you can use a dvori HTTP client to make request just like you would with other HTTP clients. It supports standard REST verbs `"get", "post", "put", "patch", "delete", "options", "head", "trace"`. Each verb is defined as the property of your client object and is a function that accepts request configs and returns a promise.

```js
const { status, data } = await client.get({ url: "httpbin.org/get" });
```

So far this isn't really anything special or different, but once you start using [plugins](#compose-plugins) dvori really starts to shine.

### Compose Plugins

Plugins allow you to hook into specific points of the clients request / response / error lifecycle.

`composePlugins(...plugins)` is a function that takes an array of plugins as arguements. Each plugin is a function that returns an object with at least one of 3 hooks:

1. Hook `onRequest(config)`:

`onRequest: config => config`

2. Hook `onResponse(response)`:

`onResponse: response => response;`

3. Hook `onError(err)`:

`onResponse: err => err;`

##### Simple Example:

This creates a custom plugin that adds a header to request before it's sent.

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

const response = await client.get({ ...config });
```

Plugins become even more useful if you have multiple API's or API endpoints that have different requirements. Checkout the examples to see how plugins can be mixed and matched to create multiple easy to use API clients.

## Compose Middleware

> Ogres & middleware are like onions, they both have layers

Middleware give you complete control over the request / response lifecycle.

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

### `createClient([plugins, middleware])`

Returns an API client

#### plugins

**Type:** Object

### composeMiddleware()

### composePlugins()

---

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

Apache-2.0
