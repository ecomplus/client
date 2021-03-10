import axios from 'axios'

// axios HTTP client
// https://github.com/axios/axios
// create an instance using the config defaults provided by the library
const instance = axios.create({
  // up to 60s timeout
  timeout: 60000
})
// always JSON for request with body data
if (!instance.defaults.headers) {
  instance.defaults.headers = {}
}
const { headers } = instance.defaults
;['post', 'patch', 'put'].forEach(method => {
  if (!headers[method]) {
    headers[method] = {}
  }
  headers[method]['Content-Type'] = 'application/json'
})

export default instance
