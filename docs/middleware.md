# Middleware

> Ogres & middleware are like onions

# Built in Middleware

-   `pagination()`
-   `OAuth1()`
-   `OAuth2()`

## Example:

```js
const { createClient, composeMiddleware } = require("../../../rad");

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
