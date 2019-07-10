/**
 * https://github.com/ecomclub/ecomplus-client
 * @author E-Com Club <ti@e-com.club>
 * @license MIT
 */

import _self from './lib/self'

import requestStoreApi from './methods/request-store-api'
import requestSearchApi from './methods/request-search-api'

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
  requestStoreApi,
  requestSearchApi
}

/**
 * @namespace ecomClient
 */
