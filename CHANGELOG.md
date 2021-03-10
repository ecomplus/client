# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [2.2.1](https://github.com/ecomplus/client/compare/v2.2.0...v2.2.1) (2021-03-10)


### Bug Fixes

* **axios-instance:** ensure `defaults.headers[method]` is defined ([39b6c24](https://github.com/ecomplus/client/commit/39b6c24a5d1f3d03a9b3ff80376e78652ff2f421))
* **axios-instance:** prevent 'Uncaught TypeError: instance.defaults.headers is undefined' error ([a1b1605](https://github.com/ecomplus/client/commit/a1b1605391e92cfaea1bfa82a5b9d81f1d5a7e08))

## [2.2.0](https://github.com/ecomplus/client/compare/v2.1.4...v2.2.0) (2021-01-24)


### Features

* **apis-base-urls:** support customizind default apis with env vars ([4d91564](https://github.com/ecomplus/client/commit/4d91564752316075ef8e0c9cf87037b60444d7ad))


### Bug Fixes

* **env:** syntax fix, must export default ([687e449](https://github.com/ecomplus/client/commit/687e44914cf2f3cd1135e40b98895831a978cfa2))
* **request:** properlly checking '.json' extensions ([7b26cf0](https://github.com/ecomplus/client/commit/7b26cf09bf273a1410705e1b86f8b72ebdbf7529))

### [2.1.4](https://github.com/ecomplus/client/compare/v2.1.3...v2.1.4) (2021-01-07)


### Bug Fixes

* **deps:** update dependency axios to v0.21.1 [security] ([#82](https://github.com/ecomplus/client/issues/82)) ([43b92ce](https://github.com/ecomplus/client/commit/43b92ce31ebd7b622b33e1a4c2294f70519add69))

### [2.1.3](https://github.com/ecomplus/client/compare/v2.1.2...v2.1.3) (2020-10-29)

### [2.1.2](https://github.com/ecomplus/client/compare/v2.1.1...v2.1.2) (2020-10-23)


### Bug Fixes

* **request-timeout:** increase cache api timeout on node ([dd48406](https://github.com/ecomplus/client/commit/dd48406f7fe6aaa2be3b565356af2054bc269033))

### [2.1.1](https://github.com/ecomplus/client/compare/v2.1.0...v2.1.1) (2020-09-10)

## [2.1.0](https://github.com/ecomplus/client/compare/v2.0.4...v2.1.0) (2020-07-28)


### Features

* **request:** retry server errors for requests without timeout ([d991312](https://github.com/ecomplus/client/commit/d9913125382f0da1eae35c36bc312599d56378a4))

### [2.0.4](https://github.com/ecomplus/client/compare/v2.0.3...v2.0.4) (2020-03-03)


### Bug Fixes

* **request:** also handle cuncorrent request, always shedule ([ed3a656](https://github.com/ecomplus/client/commit/ed3a6567a9c39be2cd9ef87bbaf4dba62d5fe09c))

### [2.0.3](https://github.com/ecomclub/ecomplus-client/compare/v2.0.2...v2.0.3) (2020-03-03)


### Bug Fixes

* **request:** add 50ms delay to search and cache api to prevent 503 ([c0eb251](https://github.com/ecomclub/ecomplus-client/commit/c0eb251bc94547bb3db41d3e609233a4acd06496))

### [2.0.2](https://github.com/ecomclub/ecomplus-client/compare/v2.0.1...v2.0.2) (2020-01-05)

### [2.0.1](https://github.com/ecomclub/ecomplus-client/compare/v2.0.0...v2.0.1) (2020-01-02)

## [2.0.0](https://github.com/ecomclub/ecomplus-client/compare/v1.1.3...v2.0.0) (2019-12-22)


### Build System

* **babel:** remove babel runtime plugin ([2ba8dd4](https://github.com/ecomclub/ecomplus-client/commit/2ba8dd4))
* **bin:** fix webpack externals for node (ecomplus/utils,axios) ([4ef168c](https://github.com/ecomclub/ecomplus-client/commit/4ef168c))
* **bin:** fix webpack externals for node target (peer deps only) ([ceca7f6](https://github.com/ecomclub/ecomplus-client/commit/ceca7f6))
* **bin:** fix webpack externals for node target (peer deps only) ([10b1166](https://github.com/ecomclub/ecomplus-client/commit/10b1166))


### BREAKING CHANGES

* **bin:** ecomplus/utils still not shipped but is no more direct dep



### [1.1.3](https://github.com/ecomclub/ecomplus-client/compare/v1.1.2...v1.1.3) (2019-09-04)



### [1.1.2](https://github.com/ecomclub/ecomplus-client/compare/v1.1.1...v1.1.2) (2019-08-28)


### Build System

* **bin:** fix node.js output config ([1a51a5c](https://github.com/ecomclub/ecomplus-client/commit/1a51a5c))



### [1.1.1](https://github.com/ecomclub/ecomplus-client/compare/v1.1.0...v1.1.1) (2019-08-28)


### Build System

* **webpack:** add Node.js target output ([20d0f3d](https://github.com/ecomclub/ecomplus-client/commit/20d0f3d))



## [1.1.0](https://github.com/ecomclub/ecomplus-client/compare/v1.0.3...v1.1.0) (2019-08-28)


### Features

* **no-timeout:** check env.ECOMCLIENT_NOTIMEOUT to reset req timeout ([86ef913](https://github.com/ecomclub/ecomplus-client/commit/86ef913))



### [1.0.3](https://github.com/ecomclub/ecomplus-client/compare/v1.0.2...v1.0.3) (2019-08-20)



### [1.0.2](https://github.com/ecomclub/ecomplus-client/compare/v1.0.1...v1.0.2) (2019-08-20)


### Bug Fixes

* **passport:** accessToken and customerId optinals ([#2](https://github.com/ecomclub/ecomplus-client/issues/2)) ([bbbb77f](https://github.com/ecomclub/ecomplus-client/commit/bbbb77f))



### [1.0.1](https://github.com/ecomclub/ecomplus-client/compare/v1.0.0...v1.0.1) (2019-08-12)



## [1.0.0](https://github.com/ecomclub/ecomplus-client/compare/v0.8.0...v1.0.0) (2019-08-12)


### Bug Fixes

* **export:** exporting both named methods and default with all ([3da37b2](https://github.com/ecomclub/ecomplus-client/commit/3da37b2))



## [0.8.0](https://github.com/ecomclub/ecomplus-client/compare/v0.7.1...v0.8.0) (2019-07-25)


### chore

* **methods:** using always a config object as method unique param ([e9a4e09](https://github.com/ecomclub/ecomplus-client/commit/e9a4e09))


### BREAKING CHANGES

* **methods:** all methods params edited, old calls will no more work



### [0.7.1](https://github.com/ecomclub/ecomplus-client/compare/v0.7.0...v0.7.1) (2019-07-24)



## [0.7.0](https://github.com/ecomclub/ecomplus-client/compare/v0.6.0...v0.7.0) (2019-07-24)


### Bug Fixes

* **request:** all APIs endpoints have JSON extension ([f945c1a](https://github.com/ecomclub/ecomplus-client/commit/f945c1a))


### chore

* **methods:** removing 'getStoreId' and 'mapBySlug' ([5012ae1](https://github.com/ecomclub/ecomplus-client/commit/5012ae1))


### Features

* **method:** new 'storefront' method (Storefront API) ([2e15e05](https://github.com/ecomclub/ecomplus-client/commit/2e15e05))


### BREAKING CHANGES

* **methods:** 'getStoreId' and 'mapBySlug' will no more work



## [0.6.0](https://github.com/ecomclub/ecomplus-client/compare/v0.5.1...v0.6.0) (2019-07-21)


### Bug Fixes

* **constants:** removing ':id' from API_PASSPORT ([1741906](https://github.com/ecomclub/ecomplus-client/commit/1741906))
* **get-store-id:** also sets channel ID on config ([2bf6f9e](https://github.com/ecomclub/ecomplus-client/commit/2bf6f9e))
* **get-store-id:** returns channel info object on promise chain ([c5c3a50](https://github.com/ecomclub/ecomplus-client/commit/c5c3a50))
* **methods:** renaming request methods with prefix 'api' ([f36f02e](https://github.com/ecomclub/ecomplus-client/commit/f36f02e))


### Features

* **method:** new 'apiPassport' method ([c510b5c](https://github.com/ecomclub/ecomplus-client/commit/c510b5c))
* **method:** new 'getStoreId' method ([7c89bc8](https://github.com/ecomclub/ecomplus-client/commit/7c89bc8))
* **method:** new 'mapBySlug' method ([9596528](https://github.com/ecomclub/ecomplus-client/commit/9596528))


### BREAKING CHANGES

* **get-store-id:** changed returned object on 'getStoreId' resolve
* **methods:** old request methods will not work (renamed)



### [0.5.1](https://github.com/ecomclub/ecomplus-client/compare/v0.5.0...v0.5.1) (2019-07-19)


### Bug Fixes

* **request:** complete absolute URI, check for debug option ([72909e3](https://github.com/ecomclub/ecomplus-client/commit/72909e3))
* **request:** fix exported request function ([4a7d3bb](https://github.com/ecomclub/ecomplus-client/commit/4a7d3bb))


### Tests

* **debug:** set window.ECOMCLIENT_DEBUG = true ([d4e9d19](https://github.com/ecomclub/ecomplus-client/commit/d4e9d19))



## [0.5.0](https://github.com/ecomclub/ecomplus-client/compare/v0.4.3...v0.5.0) (2019-07-19)


### Bug Fixes

* **methods:** renaming all client methods ([4fda72e](https://github.com/ecomclub/ecomplus-client/commit/4fda72e))


### BREAKING CHANGES

* **methods:** all methods will no more work with old names



### [0.4.3](https://github.com/ecomclub/ecomplus-client/compare/v0.4.2...v0.4.3) (2019-07-17)


### Build System

* **bin:** fix handling ecomplus/utils external dependency with webpack ([418f583](https://github.com/ecomclub/ecomplus-client/commit/418f583))



### [0.4.2](https://github.com/ecomclub/ecomplus-client/compare/v0.4.1...v0.4.2) (2019-07-17)


### Build System

* **bin:** fix webpack config, using 'config.externals' ([436817f](https://github.com/ecomclub/ecomplus-client/commit/436817f))



### [0.4.1](https://github.com/ecomclub/ecomplus-client/compare/v0.4.0...v0.4.1) (2019-07-16)


### Build System

* **bin:** fix output filenames ([cf27d8f](https://github.com/ecomclub/ecomplus-client/commit/cf27d8f))



## [0.4.0](https://github.com/ecomclub/ecomplus-client/compare/v0.3.0...v0.4.0) (2019-07-11)


### Bug Fixes

* **lib:** importing request function from lib properly ([1f381f3](https://github.com/ecomclub/ecomplus-client/commit/1f381f3))
* **request:** fix importing api constants ([5c39a82](https://github.com/ecomclub/ecomplus-client/commit/5c39a82))
* **request-store-api:** fix handling request error ([c8b89e4](https://github.com/ecomclub/ecomplus-client/commit/c8b89e4))
* **request-store-api:** store id only on url when using cache api ([761e278](https://github.com/ecomclub/ecomplus-client/commit/761e278))


### Build System

* **bin:** setup config for multiple webpack outputs ([2e24605](https://github.com/ecomclub/ecomplus-client/commit/2e24605))
* **webpack:** edit default webpack output filename ([c7a33c0](https://github.com/ecomclub/ecomplus-client/commit/c7a33c0))


### Features

* **constants:** add API_PASSPORT to constants ([1ad714b](https://github.com/ecomclub/ecomplus-client/commit/1ad714b))
* **method:** new 'requestModulesApi' method ([ae12547](https://github.com/ecomclub/ecomplus-client/commit/ae12547))
* **methods:** add 'requestGraphsApi' and 'requestPlatformApi' methods ([3cc269c](https://github.com/ecomclub/ecomplus-client/commit/3cc269c))
* **request:** add request function to lib, handle 503 errors and queue ([86c2f8c](https://github.com/ecomclub/ecomplus-client/commit/86c2f8c))


### Tests

* **fix:** update script src to new webpack output filename ([4fcd915](https://github.com/ecomclub/ecomplus-client/commit/4fcd915))



## [0.3.0](https://github.com/ecomclub/ecomplus-client/compare/v0.2.1...v0.3.0) (2019-07-10)


### Bug Fixes

* **request-store-api:** default 5s timeout for live api on browser only ([8894f01](https://github.com/ecomclub/ecomplus-client/commit/8894f01))


### Features

* **constant:** add IS_BROWSER boolean ([b10fc39](https://github.com/ecomclub/ecomplus-client/commit/b10fc39))
* **method:** new 'requestSearchApi' method ([119b0f4](https://github.com/ecomclub/ecomplus-client/commit/119b0f4))



### [0.2.1](https://github.com/ecomclub/ecomplus-client/compare/v0.2.0...v0.2.1) (2019-07-10)


### Bug Fixes

* **request-store-api:** fix handling chosing cache or live api host ([4553d64](https://github.com/ecomclub/ecomplus-client/commit/4553d64))
* **request-store-api:** fix some fuction params default values ([2fc15b8](https://github.com/ecomclub/ecomplus-client/commit/2fc15b8))
* **request-store-api:** revert 'requestStoreApi' params order ([9310837](https://github.com/ecomclub/ecomplus-client/commit/9310837))


### Build System

* **bin:** don't include dependencies to lib production output ([4a84564](https://github.com/ecomclub/ecomplus-client/commit/4a84564))



## [0.2.0](https://github.com/ecomclub/ecomplus-client/compare/v1.16.0...v0.2.0) (2019-07-09)


### Build System

* **babel:** default settings for babel traspilation ([e184387](https://github.com/ecomclub/ecomplus-client/commit/e184387))
* **bin:** setup binary build (to production) script ([bafbcbd](https://github.com/ecomclub/ecomplus-client/commit/bafbcbd))
* **webpack:** fix output library global object ([56284aa](https://github.com/ecomclub/ecomplus-client/commit/56284aa))
* **webpack:** fixes for webpack default settings ([2ddea0c](https://github.com/ecomclub/ecomplus-client/commit/2ddea0c))
* **webpack:** setup webpack default settings ([09ada09](https://github.com/ecomclub/ecomplus-client/commit/09ada09))


### Features

* **axios:** create custom axios instance ([46b6ef9](https://github.com/ecomclub/ecomplus-client/commit/46b6ef9))
* **constants:** defining api base urls with consts ([c78db76](https://github.com/ecomclub/ecomplus-client/commit/c78db76))
* **method:** new 'requestStoreApi' method ([6ef943b](https://github.com/ecomclub/ecomplus-client/commit/6ef943b))
* **self:** info about package on '_self' property ([b7d2dcb](https://github.com/ecomclub/ecomplus-client/commit/b7d2dcb))


### Tests

* setup test files ([642398c](https://github.com/ecomclub/ecomplus-client/commit/642398c))



## [0.1.0](https://github.com/ecomclub/ecomplus-client/compare/v1.16.0...v0.1.0) (2019-07-09)


### Build System

* **babel:** default settings for babel traspilation ([e184387](https://github.com/ecomclub/ecomplus-client/commit/e184387))
* **bin:** setup binary build (to production) script ([bafbcbd](https://github.com/ecomclub/ecomplus-client/commit/bafbcbd))
* **webpack:** fix output library global object ([56284aa](https://github.com/ecomclub/ecomplus-client/commit/56284aa))
* **webpack:** fixes for webpack default settings ([2ddea0c](https://github.com/ecomclub/ecomplus-client/commit/2ddea0c))
* **webpack:** setup webpack default settings ([09ada09](https://github.com/ecomclub/ecomplus-client/commit/09ada09))


### Features

* **axios:** create custom axios instance ([46b6ef9](https://github.com/ecomclub/ecomplus-client/commit/46b6ef9))
* **constants:** defining api base urls with consts ([c78db76](https://github.com/ecomclub/ecomplus-client/commit/c78db76))
* **method:** new 'requestStoreApi' method ([6ef943b](https://github.com/ecomclub/ecomplus-client/commit/6ef943b))
* **self:** info about package on '_self' property ([b7d2dcb](https://github.com/ecomclub/ecomplus-client/commit/b7d2dcb))


### Tests

* setup test files ([642398c](https://github.com/ecomclub/ecomplus-client/commit/642398c))
