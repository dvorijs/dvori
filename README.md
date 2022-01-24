<p align="center">

  <a href="https://dvorijs.com/" title="DvoriJS.com">
    <img
    width="433"
    src="https://raw.githubusercontent.com/imns/dvori/master/img/dvori-logo@2x.png"
    alt="Dvori - HTTP cLient for Node.js"
    />
  </a>

</p>

<p align="center">
  <a href="https://dvorijs.com/">Website</a>
  ·
  <a href="#Install">Installation</a>
  ·
  <a href="https://dvorijs.com/docs/introduction">Documentation</a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@dvori/core" title="View this project on npm">
    <img src="https://img.shields.io/npm/v/@dvori/core.svg?style=flat-square" alt="npm version" />
  </a>

  <a href="https://github.com/imns/dvori/issues" title="Open issues">
    <img src="https://img.shields.io/github/issues/imns/dvori.svg?style=flat-square" alt="issues" />
  </a>

  <a href="https://opensource.org/licenses/MPL-2.0" title="License">
    <img src="https://img.shields.io/github/license/imns/dvori.svg?style=flat-square" alt="MPL-2.0 License" />
  </a>

</p>

## What is Dvori?

DvoriJS is a HTTP Client for Node.js. It's completely composable. To learn more please visit the documentation at [dvorijs.com](https://dvorijs.com/).

## Simple Example

```js
const { createClient } = require("dvori");

const client = createClient();
const { status, data } = await client.get({
    url: "https://www.reddit.com/r/sausagetalk/new.json",
});

console.log(data);
```

---

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests appropriately.

## License

Mozilla Public License 2.0 (MPL-2.0)
