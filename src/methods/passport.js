import { _config } from '@ecomplus/utils'
import { API_PASSPORT } from './../lib/constants'
import request from './../lib/request'

const passport = (
  url,
  customerId,
  accessToken,
  method = 'get',
  data,
  storeId = _config.get('store_id'),
  axiosConfig
) => {
  let baseURL = API_PASSPORT
  if (!url.startsWith('http') && !url.startsWith('/' + storeId)) {
    // set Store ID on URL
    baseURL += storeId
  }

  // returns axios request promise
  return request({
    data,
    ...axiosConfig,
    url,
    baseURL,
    method,
    // setup authentication headers
    headers: {
      'X-My-ID': customerId,
      'X-Access-Token': accessToken
    }
  })
}

/**
 * @method
 * @memberof ecomClient
 * @name passport
 * @description Send HTTP request to
 * [E-Com Plus Passport REST API]{@link https://developers.e-com.plus/docs/api/#/passport/}
 * with customer login authentication.
 *
 * @param {string} url - API endpoint to request or absolute URI
 * @param {string} customerId - My ID for authenticated request
 * @param {string} accessToken - Access token for authenticated request
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

// TODO

 */

export default passport
