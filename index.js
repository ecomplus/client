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

    // Function to get product by sku
    'getProductBySku': function (sku, callback) {
      let response = runMethod(callback, '/products.json?sku=' + sku).done(function () {
        for (let i = 0; i < response.result; i++) {
          EcomIo.getProduct(response.result[i]._id, callback)
        }
      })
    },

    // Function to get product by ID product
    'getProduct': function (id, callback) {
      runMethod(callback, '/products/' + id + '.json')
    },

    // Function to get order by ID order
    'getOrder': function (id, callback) {
      runMethod(callback, '/orders/' + id + '.json')
    },

    // Function to get amount order information (total, subtotal, freight, discount)
    'getAmountOrderInformation': function (id, callback) {
      let response = EcomIo.getOrder(id, callback).done(function () {
        return response.amount
      })
    },

    // Function to get items order information (_id, product_id, sku, name, quantity, price)
    'getItemsOrderInformation': function (id, callback) {
      let response = EcomIo.getOrder(id, callback).done(function () {
        return response.items
      })
    },

    // Function to get all store brands
    'getBrands': function (filter, callback) {
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

    // Function to search products
    'searchProduts': function (term, sort, filter, callback) {
      var host = 'apx-search.e-com.plus'
      // proxy will pass XGET
      // https://www.elastic.co/guide/en/elasticsearch/reference/current/search-request-body.html
      var method = 'POST'
      var endpoint = '/items.json'

      // if sort is an object keep it
      if (typeof sort === 'number') {
        switch (sort) {
          case 1:
            // sort by sales
            sort = { 'sales': 'desc' }
            break
          case 2:
            // sort by price (lowest price -> highest price)
            sort = { 'price': 'asc' }
            break
          case 3:
            // sort by price (highest price -> lowest price)
            sort = { 'price': 'desc' }
            break
          default:
            // sort by views
            sort = { 'views': 'desc' }
        }
      } else if (typeof sort !== 'object') {
        // default sort by views
        sort = { 'views': 'desc' }
      }

      var body = {
        'query': {
          'multi_match': {
            'query': term,
            'fields': ['name', 'keywords']
          },
          'sort': [
            { 'available': true },
            '_score',
            { 'ad_relevance': 'desc' },
            sort
          ],
          'bool': { // condition, only visible products
            'filter': [
              {'term': { 'visible': true }}
            ]
          }
        }
      }

      // example filter object
      // filter = {
      //   'specifications' : {
      //     'cor': ['azul', 'vermelho']
      //   },
      //   'brands' : {
      //     'name': ['brandName']
      //   }
      // }

      if (typeof filter === 'object') {
        for (var key in filter) {
          // loop in filter object
          if (filter.hasOwnProperty(key)) {
            var propertyObject = filter[key]
            for (var key2 in propertyObject) {
              // loop in property propertyObject
              if (propertyObject.hasOwnProperty(key2) && Array.isArray(propertyObject[key2])) {
                for (var i = 0; i < propertyObject[key2].length; i++) {
                  // change the name
                  var bodytoFilter = {
                    'term': {
                      [key]: {[key2]: propertyObject[key2][i]}
                    }
                  }
                  body.bool.filter.push(bodytoFilter)
                }
              }
            }
          }
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
