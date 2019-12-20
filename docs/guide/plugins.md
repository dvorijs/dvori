# Built in Plugins

### Request Plugins

-   `baseURL(url)`
-   `headers({key, val})`
-   `data({key, val})`
-   `params({key, val})`
-   `userAgent(agentStr)`

### Response Plugins

-   `json()`

### Error Plugins

> Coming soon

# Creating Plugins

`composePlugins(...plugins)`

Plugins allow you to hook into specific points of the clients request / response / error lifecycle.

1. Hook `onRequest(config)`:

`onRequest: config => config`

2. Hook `onResponse(response)`:

`onResponse: response => response;`

3. Hook `onError(err)`:

`onResponse: err => err;`

## Example:

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
