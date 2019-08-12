/**
 * @namespace ecomClient
 * @description
 * TL;DR: You're probably wanting to use
 * [Store API]{@link ecomClient.store}.
 * <br>
 * Although, we have methods to run requests for
 * almost all E-Com Plus APIs below.
 */

import _self from './lib/self'

import store from './methods/store'
import platform from './methods/platform'
import search from './methods/search'
import graphs from './methods/graphs'
import modules from './methods/modules'
import passport from './methods/passport'
import storefront from './methods/storefront'

export {
  _self,
  store,
  platform,
  search,
  graphs,
  modules,
  passport,
  storefront
}
