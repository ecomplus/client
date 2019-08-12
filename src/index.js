/**
 * https://github.com/ecomclub/ecomplus-client
 * @author E-Com Club <ti@e-com.club>
 * @license MIT
 *
 * @description
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
 * <script src="https://cdn.jsdelivr.net/npm/@ecomplus/client/dist/ecom-client.polyfill.min.js"></script>
 */

import * as ecomClient from './ecom-client'

export default ecomClient

// named exports off all methods
export * from './ecom-client'
