import { _config } from '@ecomplus/utils'
import { API_PASSPORT } from './../lib/constants'
import request from './../lib/request'

const passport = ({
  url,
  customerId,
  accessToken,
  method = 'get',
  data,
  storeId = _config.get('store_id'),
  axiosConfig
}) => {
  let baseURL = API_PASSPORT
  if (!url.startsWith('http') && !url.startsWith('/' + storeId)) {
    // set Store ID on URL
    baseURL += storeId
  }

  let headers
  if (customerId && accessToken) {
    headers = {
      'X-My-ID': customerId,
      'X-Access-Token': accessToken
    }
  }

  // returns axios request promise
  return request({
    data,
    ...axiosConfig,
    url,
    baseURL,
    method,
    // setup authentication headers
    headers
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
 * @param {object} cfg - Request config options
 * @param {string} cfg.url - API endpoint to request or absolute URI
 * @param {string} [cfg.customerId] - My ID for authenticated request
 * @param {string} [cfg.accessToken] - Access token for authenticated request
 * @param {string} [cfg.method='get'] - Request method (HTTP verb)
 * @param {object} [cfg.data] - Request body object
 * @param {number} [cfg.storeId=_config.get('store_id')] - E-Com Plus Store ID number
 * @param {object} [cfg.axiosConfig] - Additional
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
