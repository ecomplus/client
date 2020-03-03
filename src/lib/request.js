import {
  API_STORE,
  API_PASSPORT,
  API_MODULES,
  API_STOREFRONT,
  API_GRAPHS,
  API_PLATFORM
} from './constants'
import axios from './axios'

// set delay between requests by API
const delays = {}
delays[API_STORE] = delays[API_MODULES] = delays[API_PLATFORM] = 250
delays[API_STOREFRONT] = 400
delays[API_GRAPHS] = 570
delays[API_PASSPORT] = 1070
// count current scheduled requests by API
const scheduledRequests = {}
let concurrentRequests = 0
// store APIs on idle after 503 response
const waitingApis = []

// check for debug option
const env = (typeof window === 'object' && window) || (typeof process === 'object' && process && process.env)
const checkEnvVar = prop => env && (env[prop] === true || env[prop] === 'true')
const debug = checkEnvVar('ECOMCLIENT_DEBUG')

const request = (config, api, delay = 170, scheduleTime) => {
  if (debug) {
    console.log(`[ecomClient]: (${scheduleTime} ~ ${Date.now()}) send ${config.method} ${config.url}`)
  }
  if (checkEnvVar('ECOMCLIENT_NOTIMEOUT') && config.timeout) {
    // reset request timeout
    config.timeout = 0
  }

  return new Promise((resolve, reject) => {
    concurrentRequests++
    axios.request(config)
      .then(resolve)

      .catch(err => {
        if (debug) {
          err.message = `[ecomClient]: ${err.message}`
          console.error(err)
        }
        // handle 503 errors here
        const { response } = err
        if (response && response.status === 503) {
          // service unavailable, probably blocked by proxy
          if (api) {
            // add API to idle
            waitingApis.push(api)
          }

          // retry with new promise
          // wait and resend request
          return setTimeout(() => {
            if (api) {
              // unset API idle
              const index = waitingApis.indexOf(api)
              if (index > -1) {
                waitingApis.splice(index, 1)
              }
            }
            // new axios request without error handler
            axios.request(config).then(resolve).catch(reject)
          }, delay >= 170 ? delay : 170)
        }
        reject(err)
      })

      .finally(() => {
        concurrentRequests--
      })
  })
}

export default axiosConfig => {
  const { url, method, baseURL } = axiosConfig
  if (!url.indexOf('.json') === -1) {
    // all APIs endpoints have JSON extension
    axiosConfig.url = url.replace(/^([^?]+)(\?.*)?$/, '$1.json$2')
  }

  let uri = axios.getUri(axiosConfig)
  if (!uri.startsWith('http')) {
    // complete absolute URI
    if (baseURL.slice(-1) === '/' && uri.charAt(0) === '/') {
      // prevent duplicated bars
      uri = uri.substr(1)
    }
    uri = baseURL + uri
  }
  if (debug) {
    console.log(`[ecomClient]: ${((method && method.toUpperCase()) || 'GET')} '${uri}'`)
  }

  let api, delay
  for (api in delays) {
    if (delays[api] !== undefined && uri.indexOf(api) === 0) {
      // API matched
      // delayed request
      delay = delays[api]
      break
    }
  }
  if (!delay) {
    // minimum 50ms delay
    delay = 50
  }

  // scheduled request
  // set request queue position based on current API scheduled requests
  // there's no delay when queue is 0 (first request)
  const queue = scheduledRequests[api] || 0
  scheduledRequests[api] = queue + 1

  // returns promise resolved with request after timeout
  return new Promise((resolve, reject) => {
    const schedule = () => {
      // calculate final delay with API queue and concurrent requests multipliers
      const requestDelay = delay * queue + concurrentRequests * 2.5
      let scheduleTime
      if (debug) {
        scheduleTime = Date.now()
        console.log(`[ecomClient]: (${scheduleTime}) request delay ${requestDelay}ms`)
      }

      setTimeout(() => {
        if (waitingApis.indexOf(api) <= -1) {
          // send request and reset scheduled requests count
          scheduledRequests[api]--
          request(axiosConfig, api, delay, scheduleTime).then(resolve).catch(reject)
        } else {
          // API on idle due to 503 response
          // schedule request again
          schedule()
        }
      }, requestDelay)
    }
    schedule()
  })
}
