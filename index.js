'use strict'

var isNodeJs = false
// Verify if the script is Node JS
if (typeof module !== 'undefined' && module.exports) {
  isNodeJs = true
}

var EcomIo = function () {
  let storeId, https, logger

  if (isNodeJs) {
    https = require('https')
  }

  // Function to run function by endpoint and method
  let runMethod = function (callback, endpoint, host, method, body) {
    let path
    if (!host) {
      host = 'api.e-com.plus'
      path = '/v1'
    } else if (host !== 'api.e-com.plus') {
      path = '/api/v1'
    }
    if (!method) {
      method = 'GET'
    }

    if (isNodeJs === true) {
      const options = {
        hostname: host,
        path: path + endpoint,
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'X-Store-ID': storeId
        }
      }

      const req = https.request(options, function (res) {
        if (res.statusCode !== 200) {
          // TODO: error handling
          let err = new Error('Request failed trying to get store info\nStatus code: ' + res.statusCode)
          logger.error(err)
          // consume response data to free up memory
          res.resume()
          return
        }

        let rawData = ''
        res.setEncoding('utf8')
        res.on('data', function (chunk) { rawData += chunk })
        res.on('end', function () {
          try {
            let body = JSON.parse(rawData)
            if (typeof callback === 'function') {
              callback(body)
            } else {
              return body
            }
          } catch (e) {
            logger.error(e)
          }
        })
        req.on('error', function (error) {
          logger.error('problem with request:' + error.message)
        })
        req.end()
      })
    } else {
      let ajax = new XMLHttpRequest()
      let url = 'https://' + host + path + endpoint
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

  return {
    'init': function (StoreId, Logger) {
      storeId = StoreId
      if (typeof Logger === 'object' && Logger.hasOwnProperty('log') && Logger.hasOwnProperty('error')) {
        logger = Logger
      } else {
        logger = console
      }
    },

    // return current store ID in use
    'storeId': storeId,

    // Function to get ID product by sku
    'getProductBySku': function (sku, callback) {
      let response = runMethod(callback, '/products.json?sku=' + sku).done(function () {
        for (let i = 0; i < response.result; i++) {
          EcomIo.getProduct(response.result[i]._id, callback)
        }
      })
    },

    // Function to get Product by ID product
    'getProduct': function (id, callback) {
      runMethod(callback, '/products/' + id + '.json')
    },

    // Function to get order by ID order
    'getOrder': function (id, callback) {
      runMethod(callback, '/orders/' + id + '.json')
    },

    // Function to get all store brands
    'getBrand': function (filter, callback) {
      var endpoint
      if (!filter) {
        endpoint = '/brands.json'
      } else {
        endpoint = '/brands.json?' + filter
      }
      runMethod(callback, endpoint)
    },

    // Function to get all store categories
    'getCategories': function (filter, callback) {
      var endpoint
      if (!filter) {
        endpoint = '/categories.json'
      } else {
        endpoint = '/categories.json?' + filter
      }
      runMethod(callback, endpoint)
    },

    'getProductbyName': function (term, callback) {
      var host = 'apx-search.e-com.plus'
      // proxy will pass XGET
      // https://www.elastic.co/guide/en/elasticsearch/reference/current/search-request-body.html
      var method = 'POST'
      var endpoint = '/items.json'
      var body = {
        'query': {
          'term': { 'user': term },
          'sort': [
            { 'available': true },
            { 'visible': true },
            { 'name': term }
          ]
        }
      }
      runMethod(callback, endpoint, host, method, body)
    }

  }
}
EcomIo = EcomIo()

if (isNodeJs) {
  module.exports = EcomIo
}
