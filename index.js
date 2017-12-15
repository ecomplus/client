var storeID

// GET STORE ID
function init (storeId, logger) {
  storeID = storeId
  if (typeof logger === 'object' && logger.hasOwnProperty('log') && logger.hasOwnProperty('error')) {
    console = logger
  }
}

const isNodeJS = false
const https
// Verify if the script is Node JS
if (typeof module !== 'undefined' && module.exports) {
  isNodeJS = true
  https = require('https')
}

// Function to run function by endpoint and method
function runMethod (endpoint, method, callback) {
  if (isNodeJS === true) {
    const options = {
      hostname: 'api.e-com.plus',
      path: '/v1' + endpoint,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'X-Store-ID': storeID
      }
    }

    const req = https.request(options, (res) => {
      if (res.statusCode !== 200) {
        // TODO: error handling
        let err = new Error('Request failed trying to get store info\nStatus code: ' + res.statusCode)
        console.error(err)
        // consume response data to free up memory
        res.resume()
        return
      }
      
      let rawData = ''
      res.setEncoding('utf8')
      res.on('data', (chunk) => { rawData += chunk })
      res.on('end', () => {
        try {
          let parsedData = JSON.parse(rawData)
        } catch (e) {
          console.error(e)
        }
      })
      req.on('error', function (error) {
        console.error('problem with request:' + error.message)
      })
      req.end()
    })
  } else {
    let ajax = new XMLHttpRequest()
    let url = 'https://api.e-com.plus/v1' + endpoint
    ajax.open(method, url, true)
    ajax.send()
    ajax.onreadystatechange = function () {
      if (ajax.readyState === 4 && ajax.status === 200) {
        let body = JSON.parse(ajax.responseText)
        if (typeof callback === 'function') {
          callback(body)
        } else {
          return body
        }
      }
    }
  }
}

// Function to get ID product by sku
function getProductBySku (sku) {
  let endpoint = '/products.json?sku=' + sku
  let method = 'GET'
  let response = runMethod(endpoint, method).done(function () {
    for (let i = 0; i < response.result; i++) {
      getProduct(response.result[i]._id)
    }
  })
}

// Function to get Product by ID product
function getProduct (id, callback) {
  let endpoint = '/products/' + id + '.json'
  let method = 'GET'
  runMethod(endpoint, method, callback)
}

function getOrder (id, callback) {
  let endpoint = '/orders/' + id + '.json'
  let method = 'GET'
  callback = function () {
    runMethod(endpoint, method)
  }
}

// function getProductbyName (term) {
//   // GET /twitter/tweet/_search
//   var query = {
//     'query': {
//       'term': { 'user': term },
//       'sort': [
//         { 'available': true },
//         { 'visible': true },
//         { 'name': term }
//       ]
//     }
//   }
// }
