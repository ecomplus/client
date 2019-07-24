import { _config } from '@ecomplus/utils'
import { IS_BROWSER, API_PLATFORM, API_PLATFORM_CACHE } from './../lib/constants'
import request from './../lib/request'

const platform = (
  url,
  storeId = _config.get('store_id'),
  axiosConfig
) => {
  let timeout, baseURL

  if (!/\?/.test(url) && (!axiosConfig || !axiosConfig.params)) {
    // prefer using cache API host
    timeout = 2500
    baseURL = API_PLATFORM_CACHE
  } else {
    // set 5s default timeout on browser
    timeout = IS_BROWSER ? 5000 : 30000
    baseURL = API_PLATFORM
  }

  // returns axios request promise
  return request({
    timeout,
    ...axiosConfig,
    url,
    baseURL
  })

    .catch(err => {
      const { response } = err
      if (response && baseURL === API_PLATFORM_CACHE) {
        // retry with live Main API
        const { status } = response
        if (!status || status < 100 || status >= 500) {
          // resend request with same params
          return platform(
            url,
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
 * @name platform
 * @description Send HTTP GET request to
 * [E-Com Plus Platform REST API]{@link https://developers.e-com.plus/docs/api/#/platform/}.
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

export default platform
