import env from './env'

export const IS_BROWSER = Boolean(typeof window === 'object' && window !== null && window.document)

export const API_STORE = env.ECOMCLIENT_API_STORE || 'https://api.e-com.plus/v1/'
export const API_STORE_CACHE = env.ECOMCLIENT_API_STORE_CACHE || 'https://ioapi.ecvol.com/:id/v1/'
export const API_PASSPORT = env.ECOMCLIENT_API_PASSPORT || 'https://passport.e-com.plus/v1/'
export const API_SEARCH = env.ECOMCLIENT_API_SEARCH || 'https://apx-search.e-com.plus/api/v1/'
export const API_MODULES = env.ECOMCLIENT_API_MODULES || 'https://apx-mods.e-com.plus/api/v1/'
export const API_STOREFRONT = env.ECOMCLIENT_API_STOREFRONT || 'https://iostorefront.ecvol.com/api/v1/'
export const API_GRAPHS = env.ECOMCLIENT_API_GRAPHS || 'https://apx-graphs.e-com.plus/api/v1/'
export const API_PLATFORM = env.ECOMCLIENT_API_PLATFORM || 'https://e-com.plus/api/v1/'
export const API_PLATFORM_CACHE = env.ECOMCLIENT_API_PLATFORM_CACHE || 'https://io.ecvol.com/api/v1/'
