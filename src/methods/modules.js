import { _config } from '@ecomplus/utils'
import { API_MODULES } from './../lib/constants'
import request from './../lib/request'

// returns axios request promise
const modules = ({
  url,
  method = 'get',
  data,
  storeId = _config.get('store_id'),
  axiosConfig
}) => request({
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
 * @description Send HTTP request to
 * [E-Com Plus Modules REST API]{@link https://developers.e-com.plus/docs/api/#/modules/}.
 *
 * @param {object} cfg - Request config options
 * @param {string} cfg.url - API endpoint to request or absolute URI
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

export default modules
