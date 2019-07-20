/**
 * https://github.com/ecomclub/ecomplus-client
 * @author E-Com Club <ti@e-com.club>
 * @license MIT
 */

import _self from './lib/self'

import apiStore from './methods/api-store'
import apiPlatform from './methods/api-platform'
import apiSearch from './methods/api-search'
import apiGraphs from './methods/api-graphs'
import apiModules from './methods/api-modules'
import apiPassport from './methods/api-passport'

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
  apiStore,
  apiPlatform,
  apiSearch,
  apiGraphs,
  apiModules,
  apiPassport
}

/**
 * @namespace ecomClient
 */
