import { _config } from '@ecomplus/utils'
import { IS_BROWSER, API_STOREFRONT } from './../lib/constants'
import request from './../lib/request'

const storefront = (
  url,
  storeId = _config.get('store_id'),
  axiosConfig
) => {
  if (url.charAt(0) === '/') {
    // prevent duplicated bars
    url = url.substr(1)
  }
  if (!/^\/?[0-9]+@?/.test(url) && storeId) {
    // force endpoint starting with Store ID
    url = storeId + '@' + url
  }
  // replace / with $ on slug to escape URL
  url = '/' + url.replace(/\//g, '$')

  // returns axios request promise
  return request({
    // set 5s default timeout for Storefront API requests on browser
    timeout: IS_BROWSER ? 5000 : 30000,
    ...axiosConfig,
    url,
    baseURL: API_STOREFRONT
  })
}

/**
 * @method
 * @memberof ecomClient
 * @name storefront
 * @description Send HTTP GET request to
 * [E-Com Plus Storefront REST API]{@link https://developers.e-com.plus/docs/api/#/storefront/}.
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

export default storefront
