import { _config } from '@ecomplus/utils'
import { API_STORE, API_STORE_CACHE } from './../lib/constants'
import axios from './../lib/axios'

// save Store Cache API status
let isCacheOnline = true

const requestStoreApi = (
  url,
  authenticationId,
  accessToken,
  method = 'get',
  data,
  storeId = _config.get('store_id'),
  axiosConfig
) => {
  let timeout, baseURL
  const headers = {
    'X-Store-ID': storeId
  }

  // first check if it's a public request
  if (method.toLowerCase() === 'get' && !authenticationId) {
    // less timeout for public requests
    if (isCacheOnline && !/\?/.test(url) && (!axiosConfig || !axiosConfig.params)) {
      // use cache API host
      timeout = 2500
      baseURL = API_STORE_CACHE.replace(':id', storeId)
    } else {
      timeout = 5000
      baseURL = API_STORE
    }
  } else {
    baseURL = API_STORE
    // setup authentication headers
    headers['X-My-ID'] = authenticationId
    headers['X-Access-Token'] = accessToken
  }

  // returns axios request promise
  return axios.request({
    data,
    timeout,
    ...axiosConfig,
    url,
    baseURL,
    method,
    headers
  })

    .catch(err => {
      if (baseURL === API_STORE_CACHE) {
        // retry with live Store API
        let { status } = err.response
        if (!status || status >= 500) {
          isCacheOnline = false
          setTimeout(() => { isCacheOnline = true }, 30000)
          // resend request with same params
          return requestStoreApi(
            url,
            authenticationId,
            accessToken,
            method,
            data,
            storeId,
            axiosConfig
          )
        }
      }
      // chain promise catch
      throw err
    })
}

/**
 * @method
 * @memberof ecomClient
 * @name requestStoreApi
 * @description Send HTTP request to E-Com Plus Store REST API.
 *
 * @param {string} url - API endpoint to request or absolute URI
 * @param {string} [authenticationId] - My ID for authenticated request
 * @param {string} [accessToken] - Access token for authenticated request
 * @param {string} [method='get'] - Request method (HTTP verb)
 * @param {object} [data] - Request body object
 * @param {number} [storeId=_config.get('store_id')] - E-Com Plus Store ID number
 * @param {object} [axiosConfig] - Additional
 * [axios config]{@link https://github.com/axios/axios#request-config} settings
 *
 * @returns {Promise<response|error>}
 * Axios request promise resolved with
 * [response]{@link https://github.com/axios/axios#response-schema}
 * or rejected with
 * [error]{@link https://github.com/axios/axios#handling-errors}.
 *
 * @example
 * // Simple GET request (public)
 * ecomClient.requestStoreApi('/products.json')
 *   .then(response => console.log(response.data))
 *   .catch(error => {
 *     console.error(error)
 *     if (error.response) {
 *       console.log(error.response)
 *     }
 *   })
 *
 * @example
 * // Authenticated request
 * this.authenticationId = 'myAuthenticationId'
 * this.accessToken = 'myAccessToken'
 * ecomClient.requestStoreApi(
 *   '/products.json',
 *   this.authenticationId,
 *   this.accessToken,
 *   'post',
 *   { sku: '123', name: 'Sample Prduct 123' }
 * )
 *   .then(({ data, status }) => console.log(status, data))
 *   .catch(error => console.error(error))
 */

export default requestStoreApi
