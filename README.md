# ecomplus-client

[![CodeFactor](https://www.codefactor.io/repository/github/ecomclub/ecomplus-client/badge)](https://www.codefactor.io/repository/github/ecomclub/ecomplus-client)
[![npm version](https://img.shields.io/npm/v/@ecomplus/client.svg)](https://www.npmjs.org/@ecomplus/client)
[![license mit](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

JS client for E-Com Plus REST APIs

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

### Dependencies

It requires and doesn't include
[`axios`](https://github.com/ecomclub/ecomplus-utils) and
[`@ecomplus/utils`](https://github.com/ecomclub/ecomplus-utils).

It'll be automatically imported if you're developing on Node.js
environment or using a bundler such as Webpack,
**in other case those libraries must be included manually on
window scope**.

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
