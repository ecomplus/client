/**
 * https://github.com/ecomclub/ecomplus-client
 * @author E-Com Club <ti@e-com.club>
 * @license MIT
 */

import _self from './lib/self'

import store from './methods/store'
import modules from './methods/modules'
import search from './methods/search'
import graphs from './methods/graphs'
import platform from './methods/platform'

/**
 * JS client for E-Com Plus REST APIs.
 * @module @ecomplus/client
 * @exports {@link ecomClient}
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
  modules,
  graphs,
  search,
  platform
}

/**
 * @namespace ecomClient
 */
