import { _config } from '@ecomplus/utils'
import { IS_BROWSER, API_STOREFRONT } from './../lib/constants'
import request from './../lib/request'

const mapBySlug = (slug, storeId = _config.get('store_id')) => {
  let isCurrentObject
  if (IS_BROWSER) {
    // remove the first / char from pathname
    const windowSlug = window.location.pathname.slice(1)
    if (!slug) {
      // get slug from current browser window
      slug = windowSlug
      isCurrentObject = true
    } else if (slug === windowSlug) {
      isCurrentObject = true
    }
  }
  // replace / with $ on slug to escape URL
  const endpoint = '/' + storeId + '@' + slug.replace(/\//g, '$') + '.json'

  // send request to Storefront API (Webdis)
  return request({
    url: endpoint,
    baseURL: API_STOREFRONT,
    // short 5s timeout
    timeout: 5000
  }).then(response => {
    // { "GET": "[resource]@[id]" }
    const val = response.data.GET
    if (val) {
      const [ resource, resourceId ] = val.split('@')
      if (resourceId) {
        if (isCurrentObject) {
          // set current object info on config
          _config.set('page_resource', resource)
          _config.set('page_object_id', resourceId)
        }

        // returns object with resource info on promise chain
        return {
          resource,
          _id: resourceId
        }
      }
    }

    // throw error to handle promise catch
    let err = new Error('Resource not found, invalid slug or store ID')
    // simulate axios error object
    err.response = response
    throw err
  })
}

/**
 * @method
 * @memberof ecomClient
 * @name mapBySlug
 * @description Get resource and Object ID (and set on `_config`) based on slug.
 *
 * @param {string} [slug=location.pathname.slice(1)] - Slug string (URL without first bar),
 * on browser it'll use global location object by default
 *
 * @returns {Promise<{resource,_id}|error>}
 * Promise resolved with found resource info (object with `resource` and `_id`)
 * or rejected with
 * [axios error]{@link https://github.com/axios/axios#handling-errors}.
 *
 * @example

ecomClient.mapBySlug('monitores')
  .then(objectInfo => {
    console.log(objectInfo.resource)
    console.log(objectInfo._id)
  })
  .catch(error => {
    console.error(error)
    if (error.response) {
      console.log(error.response)
    }
  })

 */

export default mapBySlug
