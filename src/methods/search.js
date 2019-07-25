import { _config } from '@ecomplus/utils'
import { IS_BROWSER, API_SEARCH } from './../lib/constants'
import request from './../lib/request'

// returns axios request promise
const search = ({
  url,
  method = 'get',
  data,
  storeId = _config.get('store_id'),
  axiosConfig
}) => request({
  data,
  // set 10s default timeout for search requests on browser
  timeout: IS_BROWSER ? 10000 : 30000,
  ...axiosConfig,
  url,
  baseURL: API_SEARCH,
  method,
  headers: {
    'X-Store-ID': storeId
  }
})

/**
 * @method
 * @memberof ecomClient
 * @name search
 * @description Send HTTP request to
 * [E-Com Plus Search REST API]{@link https://developers.e-com.plus/docs/api/#/search/}.
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

// Simple search request (ELS URI Search)
ecomClient.search({ url: '/items.json?q=sku:123' })
  .then(response => console.log(response.data))
  .catch(error => {
    console.error(error)
    if (error.response) {
      console.log(error.response)
    }
  })

 * @example

// Complex search request (ELS Request Body Search)
const data = {
  query: {
    bool: {
      must: {
        multi_match: {
          query: 'tshirt',
          fields: [ 'name', 'keywords' ]
        }
      }
    }
  }
}
ecomClient.search({ url: '/items.json', method: 'post', data })
  .then(({ data, status }) => console.log(status, data))
  .catch(error => console.error(error))

 */

export default search
