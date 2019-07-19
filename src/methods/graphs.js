import { _config } from '@ecomplus/utils'
import { IS_BROWSER, API_GRAPHS } from './../lib/constants'
import request from './../lib/request'

// returns axios request promise
const graphs = (
  url,
  storeId = _config.get('store_id'),
  axiosConfig
) => request({
  // set 5s default timeout for graphs requests on browser
  timeout: IS_BROWSER ? 5000 : 30000,
  ...axiosConfig,
  url,
  baseURL: API_GRAPHS,
  headers: {
    'X-Store-ID': storeId
  }
})

/**
 * @method
 * @memberof ecomClient
 * @name graphs
 * @description Send HTTP GET request to
 * [E-Com Plus Graphs REST API]{@link https://developers.e-com.plus/docs/api/#/graphs/}.
 *
 * @param {string} url - API endpoint to request or absolute URI
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

export default graphs
