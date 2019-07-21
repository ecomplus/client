import { _config } from '@ecomplus/utils'
import { IS_BROWSER } from './../lib/constants'
import apiPlatform from './api-platform'

const getStoreId = domain => {
  if (!domain && IS_BROWSER) {
    // get domain from current browser window
    domain = window.location.hostname
  }
  let endpoint = '/domains/' + domain + '.json'

  // send request to Platform API
  return apiPlatform(endpoint).then(({ data }) => {
    // set Store IDs on config
    _config.set('store_id', data.store_id)
    _config.set('store_object_id', data.store_object_id)

    // check for default sales channel language
    const lang = data.default_lang
    if (lang) {
      // set default lang and country codes
      _config.set('lang', lang)
      _config.set('country_code', lang.replace(/^[a-z]{2}_/, '').toUpperCase())
      if (lang === 'pt_br') {
        // also change default currency
        _config.set('currency', 'BRL')
        _config.set('currency_symbol', 'R$')
      }
    }

    // returns Store ID number on promise chain
    return data.store_id
  })
}

/**
 * @method
 * @memberof ecomClient
 * @name getStoreId
 * @description Get Store IDs and default lang (and set on `_config`) based on domain name.
 *
 * @param {string} [domain=location.hostname] - Sales channel domain name, on browser it'll
 * use global location object by default
 *
 * @returns {Promise<storeId|error>}
 * Promise resolved with `storeId` number or rejected with
 * [axios error]{@link https://github.com/axios/axios#handling-errors}.
 *
 * @example

// TODO

 */

export default getStoreId
