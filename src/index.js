/**
 * https://github.com/ecomclub/ecomplus-client
 * @author E-Com Club <ti@e-com.club>
 * @license MIT
 */

import _self from './lib/self'

import store from './methods/store'
import platform from './methods/platform'
import search from './methods/search'
import graphs from './methods/graphs'
import modules from './methods/modules'
import passport from './methods/passport'
import storefront from './methods/storefront'

/**
 * JS client for E-Com Plus REST APIs.
 * @module @ecomplus/client
 * @see ecomClient
 *
 * @example
 * // ES import
 * import ecomClient from '@ecomplus/client'
 *
 * @example
 * // With CommonJS
 * const ecomClient = require('@ecomplus/client')
 *
 * @example
 * <!-- Global `ecomClient` from CDN on browser -->
 * <script src="https://cdn.jsdelivr.net/npm/@ecomplus/client"></script>
 */

export {
  _self,
  store,
  platform,
  search,
  graphs,
  modules,
  passport,
  storefront
}

/**
 * @namespace ecomClient
 * @description
 * TL;DR: You're probably wanting to use
 * [Store API]{@link ecomClient.store}.
 * <br>
 * Although, we have methods to run requests for
 * almost all E-Com Plus APIs below.
 */
