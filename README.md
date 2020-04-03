# dvori

dvori is a functional composable HTTP client for Node.js

## Installation

Use the package manager [npm](https://www.npmjs.com/package/dvori) to install dvori.

```js
npm install dvori
```

## Usage

```js
const { createClient } = require("dvori");

const client = createClient();

const response = client.get({ url: "httpbin.org/get" });
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

Apache-2.0
