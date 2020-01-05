/*!
 * @ecomplus/client
 * (c) E-Com Club <ti@e-com.club>
 * Released under the MIT License.
 */

/**
 * JS client for E-Com Plus REST APIs.
 * {@link https://github.com/ecomclub/ecomplus-client GitHub}
 *
 * @module @ecomplus/client
 * @author E-Com Club <ti@e-com.club>
 * @return {@link ecomClient}
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
