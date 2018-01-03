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

  // header for logger.log
  let logHeader = function (logType) {
    return 'E-Com Plus SDK ' + logType + ':'
  }

  // header for logger.log
  let errorHandling = function (callback, errMsg, responseBody) {
    if (responseBody === undefined) {
      // default to null
      // when error occurs before send API request
      responseBody = null
    }

    logger.log(logHeader('WARNING') + '\n' + errMsg)
    if (typeof callback === 'function') {
      let err = new Error(errMsg)
      callback(err, responseBody)
    }
  }

  // Function to run function by endpoint and method
  let runMethod = function (callback, endpoint, host, method, body) {
    if (typeof callback !== 'function') {
      let msg = 'You need to specify a callback function to receive the request response'
      errorHandling(null, msg)
      return
    }

    let path
    if (!host) {
      // default to E-Com Plus Store API
      // https://ecomstore.docs.apiary.io/
      host = 'api.e-com.plus'
      path = '/v1'
    } else if (host !== 'api.e-com.plus') {
      // Graphs API or Search API
      // https://ecomgraphs.docs.apiary.io/
      // https://ecomsearch.docs.apiary.io/
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
                  logger.log(logHeader('WARNING') + '\n' + msg)
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
                logger.log(logHeader('WARNING') + '\n' + msg)
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
    'searchProduts': function (callback, term, from, size, sort, specs, brands, categories, prices, dsl) {
      let host = 'apx-search.e-com.plus'
      // proxy will pass XGET
      let method = 'POST'
      let endpoint = '/items.json'
      let body

      if (typeof dsl === 'object' && dsl !== null) {
        // custom Query DSL
        // must be a valid search request body
        // https://www.elastic.co/guide/en/elasticsearch/reference/current/search-request-body.html
        body = dsl
      } else {
        // term is required
        if (typeof term !== 'string') {
          let msg = 'Search term is required and must be a string'
          errorHandling(callback, msg)
          return
        }

        if (typeof sort === 'number') {
          // defines most common sorting options
          switch (sort) {
            case 1:
              // sort by sales
              sort = {
                'sales': 'desc'
              }
              break

            case 2:
              // sort by price
              // lowest price -> highest price
              sort = {
                'price': 'asc'
              }
              break

            case 3:
              // sort by price
              // highest price -> lowest price
              sort = {
                'price': 'desc'
              }
              break

            default:
              // default sort by views
              sort = {
                'views': 'desc'
              }
          }
        } else {
          // default sort by views
          sort = {
            'views': 'desc'
          }
        }

        body = {
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
                    'field': 'specs.key',
                    'size': 12
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
            },
            // Metric Aggregations
            'min_price': {
              'min': {
                'field': 'price'
              }
            },
            'max_price': {
              'max': {
                'field': 'price'
              }
            },
            'avg_price': {
              'avg': {
                'field': 'price'
              }
            }
          }
        }
        // pagination
        // https://www.elastic.co/guide/en/elasticsearch/reference/current/search-request-from-size.html
        if (typeof from === 'number' && from > 0) {
          // offset
          body.from = from
        }
        if (typeof size === 'number' && size > 0) {
          // limit
          body.size = size
        } else {
          // default page size
          body.size = 24
        }

        // filters
        if (typeof specs === 'object' && specs !== null && Object.keys(specs).length > 0) {
          // nested ELS object
          // http://nocf-www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-nested-query.html
          let nestedQuery = {
            'nested': {
              'path': 'specs',
              'query': {
                'bool': {
                  'filter': []
                }
              }
            }
          }

          for (let key in specs) {
            if (Array.isArray(specs[key]) && specs[key].length > 0) {
              nestedQuery.nested.query.bool.filter.push({
                'term': {
                  'specs.key': key
                }
              }, {
                'terms': {
                  'specs.value': specs[key]
                }
              })

              // add filter
              body.query.bool.filter.push(nestedQuery)
            }
          }
        }

        if (Array.isArray(brands) && brands.length > 0) {
          // add filter
          body.query.bool.filter.push({
            'terms': {
              'brands.name': brands
            }
          })
        }

        if (Array.isArray(categories) && categories.length > 0) {
          // add filter
          body.query.bool.filter.push({
            'terms': {
              'categories.name': categories
            }
          })
        }

        // price ranges
        if (typeof prices === 'object' && prices !== null && Object.keys(prices).length > 0) {
          let rangeQuery = {
            'range': {
              'price': {}
            }
          }
          if (typeof prices.min === 'number' && !isNaN(prices.min)) {
            rangeQuery.range.price.gte = prices.min
          }
          if (typeof prices.max === 'number' && !isNaN(prices.max)) {
            rangeQuery.range.price.lte = prices.max
          }

          // add filter
          body.query.bool.filter.push(rangeQuery)
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
      runMethod(callback, '/products/' + id + '/recommended.json', host)
    },

    'getRelatedProducts': function (callback, id) {
      let host = 'apx-graphs.e-com.plus'
      runMethod(callback, '/products/' + id + '/related.json', host)
    }
  }
}
EcomIo = EcomIo()

if (isNodeJs) {
  module.exports = EcomIo
}
