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
    'getProductBySku': function (callback, sku) {
      let response = runMethod(callback, '/products.json?sku=' + sku).done(function () {
        for (let i = 0; i < response.result; i++) {
          EcomIo.getProduct(callback, response.result[i]._id)
        }
      })
    },

    // Function to get product by ID product
    'getProduct': function (callback, id) {
      runMethod(callback, '/products/' + id + '.json')
    },

    // Function to get order by ID order
    'getOrder': function (callback, id) {
      runMethod(callback, '/orders/' + id + '.json')
    },

    // Function to get all store brands
    'getBrands': function (callback, filter) {
      let endpoint = '/brands.json'
      if (filter) {
        endpoint += filter
      }
      runMethod(callback, endpoint)
    },

    // Function to get all store categories
    'getCategories': function (callback, filter) {
      let endpoint = '/categories.json'
      if (filter) {
        endpoint += filter
      }
      runMethod(callback, endpoint)
    },

    // Function to search products
    'searchProduts': function (callback, term, sort, filter) {
      let host = 'apx-search.e-com.plus'
      // proxy will pass XGET
      // https://www.elastic.co/guide/en/elasticsearch/reference/current/search-request-body.html
      let method = 'POST'
      let endpoint = '/items.json'

      // header for logger.log
      let logHeader = function (logType) {
        return 'E-Com Plus SDK => searchProduts ' + logType + ':'
      }

      // default sort by views
      let defaultSort = { 'views': 'desc' }
      switch (typeof sort) {
        case 'number':
          // defines most common sorting options
          switch (sort) {
            case 1:
              // sort by sales
              sort = { 'sales': 'desc' }
              break

            case 2:
              // sort by price
              // lowest price -> highest price
              sort = { 'price': 'asc' }
              break

            case 3:
              // sort by price
              // highest price -> lowest price
              sort = { 'price': 'desc' }
              break

            default:
              sort = defaultSort
          }
          break

        case 'object':
          // if sort is an object keep it
          if (sort === null) {
            sort = defaultSort
          }
          break

        default:
          // unexpected type
          sort = defaultSort
      }

      let body = {
        'query': {
          'multi_match': {
            'query': term,
            'fields': [
              'name',
              'keywords'
            ]
          },
          'sort': [
            {
              'available': true
            },
            '_score',
            {
              'ad_relevance': 'desc'
            },
            sort
          ],
          'bool': {
            // condition, only visible products
            'filter': [
              {
                'term': {
                  'visible': true
                }
              }
            ]
          }
        },
        'aggs': {
          'brands': {
            'terms': {
              'field': 'brands.name'
            }
          },
          'categories': {
            'terms': {
              'field': 'categories.name'
            }
          },
          // ref.: https://github.com/elastic/elasticsearch/issues/5789
          'specs': {
            'nested': {
              'path': 'specs'
            },
            'aggs': {
              'key': {
                'terms': {
                  'field': 'specs.key'
                },
                'aggs': {
                  'value': {
                    'terms': {
                      'field': 'specs.value'
                    }
                  }
                }
              }
            }
          }
        }
      }

      /*
      Example of filter object
      filter = {
        'specs.color': [ 'blue', 'red' ],
        'brands.name': [ 'Sample Shirt Inc' ],
        'categories.name': [ 'Polo Shirts' ]
      }
      */

      if (typeof filter === 'object') {
        for (let key in filter) {
          // loop in filter object
          if (filter.hasOwnProperty(key)) {
            let invalidType = function () {
              let msg = logHeader('WARNING') +
                '\nInvalid filter property type' +
                '\nProperty of filter object must be a string or array of strings' +
                '\nSkipping property "' + key + '"'
              logger.log(msg)
            }

            if (Array.isArray(filter[key])) {
              // array of strings
              let validArray = true
              for (let i = 0; i < filter[key].length; i++) {
                if (typeof filter[key] !== 'string') {
                  validArray = false
                  break
                }
              }
              if (!validArray) {
                invalidType()
                continue
              }
            } else if (typeof filter[key] !== 'string') {
              // unexpected type
              // skip
              invalidType()
              continue
            }

            // ELS Term Query
            // https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-term-query.html
            let termQuery = {
              'term': {}
            }
            termQuery.term[key] = filter[key]

            // split dot notation
            let paths = key.split('.')
            let field = paths[0]

            switch (field) {
              case 'specs':
              case 'variations':
                // nested ELS object
                // http://nocf-www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-nested-query.html
                if (!body.query.hasOwnProperty('nested')) {
                  body.query.nested = {
                    'path': field,
                    'score_mode': 'avg',
                    'query': {
                      'bool': {
                        'filter': [
                          termQuery
                        ]
                      }
                    }
                  }
                } else {
                  // check nested path
                  if (body.query.nested.path === field) {
                    body.query.nested.query.bool.filter.push(termQuery)
                  } else {
                    let msg = logHeader('WARNING') +
                      '\nYou cannot filter by specs and variations at the same time' +
                      '\nDo not query by two different nested fields' +
                      '\nSkipping property "' + key + '"'
                    logger.log(msg)
                  }
                }
                break

              default:
                // normal field
                body.query.bool.filter.push(body)
            }
          }
        }
      }

      let msg = logHeader('INFO') +
        '\nQuery DSL' +
        '\n' + JSON.stringify(body)
      logger.log(msg)

      runMethod(callback, endpoint, host, method, body)
    },

    'getRecommendedProducts': function (callback, id) {
      let host = 'apx-graphs.e-com.plus'
      runMethod(callback, '/products/' + id + 'recommended.json', host)
    },

    'getRelatedProducts': function (callback, id) {
      let host = 'apx-graphs.e-com.plus'
      runMethod(callback, '/products/' + id + 'related.json', host)
    }
  }
}
EcomIo = EcomIo()

if (isNodeJs) {
  module.exports = EcomIo
}
