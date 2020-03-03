# E-Com Plus Client

[![Publish](https://github.com/ecomplus/client/workflows/Publish/badge.svg)](https://github.com/ecomplus/client/actions?workflow=Publish) [![CodeFactor](https://www.codefactor.io/repository/github/ecomplus/client/badge)](https://www.codefactor.io/repository/github/ecomplus/client) [![npm version](https://img.shields.io/npm/v/@ecomplus/client.svg)](https://www.npmjs.org/@ecomplus/client) [![License MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

JS client for E-Com Plus REST APIs

[CHANGELOG](https://github.com/ecomplus/client/blob/master/CHANGELOG.md)

## Usage

**TL;DR**: We have [methods](https://developers.e-com.plus/client/ecomClient.html) to run requests for almost all E-Com Plus APIs, but you're probably searching for [Store API](https://developers.e-com.plus/client/ecomClient.html#.store).

The `@ecomplus/client` package provides a [list of methods](https://developers.e-com.plus/client/ecomClient.html), each one is a function to request a specific E-Com Plus REST API, using [axios](https://github.com/axios/axios) HTTP client and returning a [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise).

It's available for both Node.js and browser environments.

- [Get started](https://developers.e-com.plus/client/module-@ecomplus_client.html)
- [Methods](https://developers.e-com.plus/client/ecomClient.html)

### Store API request example

```js
import { store } from '@ecomplus/client'

const authenticationId = 'myAuthenticationId'
const accessToken = 'myAccessToken'

ecomClient.store({
  url: '/products.json',
  authenticationId,
  accessToken,
  method: 'post',
  data: { sku: '123', name: 'Sample Prduct 123' }
})
  .then(({ data, status }) => console.log(status, data))
  .catch(error => console.error(error))
```

### Dependencies

It requires and _may not_ include `core-js`, [`axios`](https://github.com/axios/axios) and [`@ecomplus/utils`](https://github.com/ecomplus/utils).

#### Node.js

```bash
npm i --save @ecomplus/utils @ecomplus/client
```

#### Webpack

```bash
npm i --save core-js @ecomplus/utils @ecomplus/client
```

#### CDN

```html
<script src="https://cdn.jsdelivr.net/npm/@ecomplus/client/dist/ecom-client.polyfill.min.js"></script>
```

`axios` and `ecomUtils` libraries **must be included separately** and available on window scope.

## Development

Fork/clone this repository and install dependencies normally:

```bash
git clone https://github.com/ecomplus/client
cd client
npm i
```

Then you can edit source files and test locally with `npm run serve`.

### Contributing

Please read the [contribution guidelines](CONTRIBUTING.md).

### Deploy

Take a look on `package.json` scripts:

- `npm run doc` - Update jsdoc/docdash generated documentation;
- `npm run release` - Generate changelog and new version;
