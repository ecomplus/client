import { _config } from '@ecomplus/utils'
import { API_MODULES } from './../lib/constants'
import request from './../lib/request'

// returns axios request promise
const modules = (
  url,
  method = 'get',
  data,
  storeId = _config.get('store_id'),
  axiosConfig
) => request({
  data,
  ...axiosConfig,
  url,
  baseURL: API_MODULES,
  method,
  headers: {
    'X-Store-ID': storeId
  }
})

/**
 * @method
 * @memberof ecomClient
 * @name modules
 * @description Send HTTP GET request to
 * [E-Com Plus Modules REST API]{@link https://developers.e-com.plus/docs/api/#/modules/}.
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

export default modules
