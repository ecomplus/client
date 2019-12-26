# ecomplus-client

[![CodeFactor](https://www.codefactor.io/repository/github/ecomclub/ecomplus-client/badge)](https://www.codefactor.io/repository/github/ecomclub/ecomplus-client)
[![npm version](https://img.shields.io/npm/v/@ecomplus/client.svg)](https://www.npmjs.org/@ecomplus/client)
[![license mit](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

JS client for E-Com Plus REST APIs

[Changelog](https://github.com/ecomclub/ecomplus-client/blob/master/CHANGELOG.md)

## Usage

**TL;DR**: We have
[methods](https://developers.e-com.plus/ecomplus-client/ecomClient.html)
to run requests for almost all E-Com Plus APIs,
but you're probably searching for
[Store API](https://developers.e-com.plus/ecomplus-client/ecomClient.html#.store).

The `@ecomplus/client` package provides a
[list of methods](https://developers.e-com.plus/ecomplus-client/ecomClient.html),
each one is a function to request a specific E-Com Plus REST API,
using [axios](https://github.com/axios/axios) HTTP client
and returning a
[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise).

It's available for both Node.js and browser environments.

- [Get started](https://developers.e-com.plus/ecomplus-client/module-@ecomplus_client.html)
- [Methods](https://developers.e-com.plus/ecomplus-client/ecomClient.html)

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

It requires and _may not_ include
`core-js`, [`axios`](https://github.com/axios/axios) and
[`@ecomplus/utils`](https://github.com/ecomclub/ecomplus-utils).

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

`axios` and `ecomUtils` libraries **must be included separately**
and available on window scope.

## Development

We're using
[Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0-beta.4/),
all commit messages must follow these conventions.

For documentation, we're using [jsdoc](https://jsdoc.app/),
all methods should be well documented.

### Contributing

1. Fork the repository;

2. Create a new branch with the name of your proposal;

4. Clone the repository:
```bash
git clone git@github.com:{user}/ecomplus-client.git
```

5. Move to folder and install dependencies:
```bash
cd ecomplus-client
npm i
```

6. Run dev server and use global `ecomClient`
or edit `test/demo.js` for tests on http://localhost:9245/:
```bash
npm run serve
```

7. Commit changes following
[Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0-beta.4/);

8. Create a new [PR](https://github.com/ecomclub/ecomplus-client/pulls)
describing your proposal :)

### Deploy

Take a look on `package.json` scripts:

- `npm run doc` - Update jsdoc/docdash generated documentation;
- `npm run release` - Generate changelog and new version;
