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
// store APIs on idle after 503 response
const waitingApis = []

const request = (config, api, delay = 170) => axios.request(config).catch(err => {
  // handle 503 errors here
  let { response } = err
  if (response && response.status === 503) {
    // service unavailable, probably blocked by proxy
    if (api) {
      // add API to idle
      waitingApis.push(api)
    }

    // retry with new promise
    return new Promise((resolve, reject) => {
      // wait and resend request
      setTimeout(() => {
        if (api) {
          // unset API idle
          const index = waitingApis.indexOf(api)
          if (index > -1) {
            waitingApis.splice(index, 1)
          }
        }
        // new axios request without error handler
        axios.request(config).then(resolve).catch(reject)
      }, delay)
    })
  }

  // chain promise catch
  throw err
})

export default axiosConfig => () => {
  const uri = axios.getUri(axiosConfig)
  let api, delay
  for (api in delays) {
    if (delays.hasOwnProperty(api) && uri.indexOf(api) === 0) {
      // API matched
      // delayed request
      delay = delays[api]
      break
    }
  }

  if (!delay) {
    // returns request promise directly
    return request(axiosConfig, api)
  } else {
    // scheduled request
    // set request queue position based on current API scheduled requests
    // there's no delay when queue is 0 (first request)
    const queue = scheduledRequests[api] || 0
    scheduledRequests[api] = queue + 1

    // returns promise resolved with request after timeout
    return new Promise((resolve, reject) => {
      const schedule = () => {
        setTimeout(() => {
          if (waitingApis.indexOf(api) <= -1) {
            // send request and reset scheduled requests count
            scheduledRequests[api]--
            request(axiosConfig, api, delay).then(resolve).catch(reject)
          } else {
            // API on idle due to 503 response
            // schedule request again
            schedule()
          }
        }, delay * queue)
      }
      schedule()
    })
  }
}
