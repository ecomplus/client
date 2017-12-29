'use strict'
var XMLHttpRequest // Global Variable to fix linter error
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
    let tries = 0
    if (isNodeJs === true) {
      let options = {
        hostname: host,
        path: path + endpoint,
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'X-Store-ID': storeId
        }
      }

      let send = function () {
        // send request
        let req = https.request(options, function (res) {
          tries++
          if (res.statusCode === 503 && tries < 3) {
            // try to resend request
            setTimeout(function () {
              send()
            }, 500)
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
                let err
                if (res.statusCode === 200) {
                  err = null
                } else {
                  let msg
                  if (body.hasOwnProperty('message')) {
                    msg = body.message
                  } else {
                    msg = 'Unknown error, see response objet to more info'
                    // logger.error(body)
                  }
                  err = new Error(msg)
                }

                callback(err, body)
              } else {
                // without callback (?)
                return body
              }
            } catch (e) {
              logger.error(e)
            }
          })
          req.on('error', function (err) {
            logger.error(err)
          })
          if (body) {
            req.write(JSON.stringify(body))
          }
          req.end()
        })
      }
    } else {
      let ajax = new XMLHttpRequest()
      let url = 'https://' + host + path + endpoint
      ajax.open(method, url, true)
      if (body) {
        ajax.send(JSON.stringify(body))
      } else {
        ajax.send()
      }
      let tries = 0
      let sendAjax = function () {
        tries++
        ajax.onreadystatechange = function () {
          let body = JSON.parse(ajax.responseText)
          if (ajax.status === 503 && tries < 3) {
            setTimeout(function () {
              sendAjax()
            }, 500)
          }
          try {
            if (typeof callback === 'function') {
              let err
              if (ajax.readyState === 4 && ajax.status === 200) {
                err = null
              } else {
                let msg
                if (body.hasOwnProperty('message')) {
                  msg = body.message
                } else {
                  msg = 'Unknown error, see response objet to more info'
                  // logger.error(body)
                }
                err = new Error(msg)
              }
              callback(err, body)
            } else {
              return body
            }
          } catch (e) {
            logger.error(e)
          }
        }
      }
    }
  }

  return {
    'init': function (StoreId, Logger) {
      storeId = StoreId
      if (typeof Logger === 'object' && Logger.hasOwnProperty('log') && Logger.hasOwnProperty('error')) {
        // log on file
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

    // Function to get all store brands
    'getBrands': function (callback, filter) {
      var endpoint
      if (!filter) {
        endpoint = '/brands.json'
      } else {
        endpoint = '/brands.json?' + filter
      }
      runMethod(callback, endpoint)
    },

    // Function to get all store categories
    'getCategories': function (callback, filter) {
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
      //     'color': ['blue', 'red']
      //   },
      //   'brands' : {
      //     'name': ['brandName']
      //   }
      // }

      if (typeof filter === 'object') {
        for (let key in filter) {
          // loop in filter object
          if (filter.hasOwnProperty(key)) {
            let propertyObject = filter[key]
            for (let key2 in propertyObject) {
              // loop in property propertyObject
              if (propertyObject.hasOwnProperty(key2) && Array.isArray(propertyObject[key2])) {
                for (let i = 0; i < propertyObject[key2].length; i++) {
                  // change the name
                  let bodytoFilter = {
                    'term': {}
                  }
                  bodytoFilter.term[key] = {}
                  bodytoFilter.term[key][key2] = propertyObject[key2][i]
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
