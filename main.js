'use strict'

var isNodeJs = false
// Verify if the script is Node JS
if (typeof module !== 'undefined' && module.exports) {
  isNodeJs = true
}

var EcomIo = function () {
  var storeId, https, logger

  if (isNodeJs) {
    https = require('https')
  }

  var logHeader = function (logType) {
    // common header for logger.log
    return 'E-Com Plus SDK ' + logType + ':'
  }

  var errorHandling = function (callback, errMsg, responseBody) {
    if (typeof callback === 'function') {
      var err = new Error(errMsg)
      if (responseBody === undefined) {
        // body null when error occurs before send API request
        callback(err, null)
      } else {
        callback(err, responseBody)
      }
    }
    logger.log(logHeader('WARNING') + '\n' + errMsg)
  }

  var runMethod = function (callback, endpoint, host, body) {
    var msg
    if (typeof callback !== 'function') {
      msg = 'You need to specify a callback function to receive the request response'
      errorHandling(null, msg)
      return
    }

    var path
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
    } else {
      // host defined to Store API
      path = '/v1'
    }
    path += endpoint
    // eg.: /v1/products.json

    // retry up to 3 times if API returns 503
    var tries = 0
    sendRequest(tries, host, path, body, callback)

    msg = logHeader('INFO') +
      '\nAPI endpoint' +
      '\n' + endpoint
    logger.log(msg)
  }

  var sendRequest = function (tries, host, path, body, callback) {
    // send request to API
    var method
    if (!body) {
      // default to GET request
      method = 'GET'
    } else {
      // request with body
      method = 'POST'
    }

    if (isNodeJs === true) {
      // call with NodeJS http module
      var options = {
        hostname: host,
        path: path,
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'X-Store-ID': storeId
        }
      }

      var req = https.request(options, function (res) {
        if (res.statusCode === 503 && tries < 3) {
          // try to resend request
          setTimeout(function () {
            sendRequest(tries, host, path, body, callback)
          }, 500)
          // consume response data to free up memory
          res.resume()
          return
        }

        var rawData = ''
        res.setEncoding('utf8')
        res.on('data', function (chunk) {
          // buffer
          rawData += chunk
        })
        res.on('end', function () {
          // treat response
          response(res.statusCode, rawData, callback)
        })
      })

      req.on('error', function (err) {
        logger.error(err)
        // callback with null body
        callback(err, null)
      })

      if (body) {
        // send JSON body
        req.write(JSON.stringify(body))
      }
      req.end()
    } else {
      // call with AJAX
      var ajax = new XMLHttpRequest()
      var url = 'https://' + host + path
      ajax.open(method, url, true)

      if (body) {
        // send JSON body
        ajax.send(JSON.stringify(body))
      } else {
        ajax.send()
      }

      ajax.onreadystatechange = function () {
        if (this.readyState === 4) {
          // request finished and response is ready
          if (this.status === 503 && tries < 3) {
            // try to resend request
            setTimeout(function () {
              sendRequest(tries, host, path, body, callback)
            }, 500)
            return
          }

          // treat response
          response(this.status, this.responseText, callback)
        }
      }
    }

    // tried more once
    tries++
  }

  var response = function (status, data, callback) {
    // treat request response
    var body
    try {
      // expecting valid JSON response body
      body = JSON.parse(data)
    } catch (err) {
      logger.error(err)
      // callback with null body
      callback(err, null)
      return
    }

    if (status === 200) {
      // err null
      callback(null, body)
    } else {
      var msg
      if (body.hasOwnProperty('message')) {
        msg = body.message
      } else {
        // probably an error response from Graphs or Search API
        // not handling Neo4j and Elasticsearch errors
        msg = 'Unknown error, see response objet to more info'
      }
      errorHandling(callback, msg, body)
    }
  }

  var idValidate = function (callback, id) {
    // check MongoDB ObjectID
    var msg
    if (typeof id === 'string') {
      // RegEx pattern
      if (id.match(/^[a-f0-9]{24}$/)) {
        return true
      } else {
        msg = 'ID must be a valid 24 hexadecimal digits string, lowercase only'
      }
    } else {
      msg = 'ID is required and must be a string'
    }
    errorHandling(callback, msg)
    return false
  }

  var getById = function (callback, resource, id) {
    if (idValidate(callback, id)) {
      // use Cloudflare cache of Store API
      var host = 'cache.e-com.plus'
      runMethod(callback, '/' + resource + '/' + id + '.json', host)
    }
  }

  var getByField = function (callback, field, fieldName, resource, endpoint, ioMethod) {
    // common function to all getAnyByAny methods
    if (typeof field === 'string') {
      runMethod(function (err, body) {
        // replace callback
        if (!err) {
          var results = body.result
          // results must be an array of one object with _id property
          if (Array.isArray(results) && typeof results[0] === 'object' && results[0] !== null) {
            // return resource object
            ioMethod(callback, results[0]._id)
          } else {
            var msg = 'Any ' + resource + ' found with this ' + fieldName
            errorHandling(callback, msg, body)
          }
        } else {
          // only pass the error
          callback(err, body)
        }
      }, endpoint)
    } else {
      var msg = 'The' + fieldName + ' is required and must be a string'
      errorHandling(callback, msg)
    }
  }

  var queryString = function (offset, limit, sort, fields, customQuery) {
    // mount query string with function params
    // common Restful URL params
    // ref.: https://ecomstore.docs.apiary.io/#introduction/overview/url-params
    var params = {}
    // default for empty string
    var query = ''

    if (typeof customQuery !== 'string') {
      // pagination
      if (typeof offset === 'number' && offset > 0) {
        params.offset = offset
      }
      if (typeof limit === 'number' && limit > 0) {
        params.limit = limit
      }

      if (typeof sort === 'number') {
        // defines most common sorting options
        switch (sort) {
          case 1:
            // sort by name asc
            params.sort = 'name'
            break

          case 2:
            // sort by name desc
            params.sort = '-name'
            break
        }
      }

      if (Array.isArray(fields)) {
        var fieldsString = ''
        for (var i = 0; i < fields.length; i++) {
          if (typeof fields[i] === 'string') {
            if (fieldsString !== '') {
              // separate fields names by ,
              // url encoded
              fieldsString += '%2C'
            }
            // fields must be valid object properties
            // does not need to encode
            fieldsString += fields[i]
          }
        }
        if (fieldsString !== '') {
          params.fields = fieldsString
        }
      }

      // serialize object to query string
      for (var param in params) {
        if (params.hasOwnProperty(param)) {
          if (query !== '') {
            query += '&'
          }
          query += param + '=' + params[param]
        }
      }
    } else {
      query = customQuery
    }

    if (query !== '') {
      query = '?' + query
    }
    return query
  }

  return {
    'init': function (StoreId, Logger) {
      // set store ID
      storeId = StoreId

      if (typeof Logger === 'object' && Logger.hasOwnProperty('log') && Logger.hasOwnProperty('error')) {
        // log on file
        logger = Logger
      } else {
        logger = console
      }
    },

    // return current store ID
    'storeId': function () {
      return storeId
    },

    'getProduct': function (callback, id) {
      getById(callback, 'products', id)
    },

    'getProductBySku': function (callback, sku) {
      var endpoint = '/products.json?sku=' + sku
      getByField(callback, sku, 'SKU', 'product', endpoint, EcomIo.getProduct)
    },

    'getOrder': function (callback, id) {
      getById(callback, 'orders', id)
    },

    'getCart': function (callback, id) {
      getById(callback, 'carts', id)
    },

    'getCustomer': function (callback, id) {
      getById(callback, 'customers', id)
    },

    'getApplication': function (callback, id) {
      getById(callback, 'applications', id)
    },

    'getBrand': function (callback, id) {
      getById(callback, 'brands', id)
    },

    'findBrandBySlug': function (callback, slug) {
      var endpoint = '/brands.json?limit=1&slug=' + slug
      getByField(callback, slug, 'slug', 'brand', endpoint, EcomIo.getBrand)
    },

    'listBrands': function (callback, offset, limit, sort, fields, customQuery) {
      var endpoint = '/brands.json' + queryString(offset, limit, sort, fields, customQuery)
      runMethod(callback, endpoint)
    },

    'getCategory': function (callback, id) {
      getById(callback, 'categories', id)
    },

    'findCategoryBySlug': function (callback, slug) {
      var endpoint = '/categories.json?limit=1&slug=' + slug
      getByField(callback, slug, 'slug', 'category', endpoint, EcomIo.getCategory)
    },

    'listCategories': function (callback, offset, limit, sort, fields, customQuery) {
      var endpoint = '/categories.json' + queryString(offset, limit, sort, fields, customQuery)
      runMethod(callback, endpoint)
    },

    'getCollection': function (callback, id) {
      getById(callback, 'collections', id)
    },

    'findCollectionBySlug': function (callback, slug) {
      var endpoint = '/collections.json?limit=1&slug=' + slug
      getByField(callback, slug, 'slug', 'collection', endpoint, EcomIo.getCollection)
    },

    'listCollections': function (callback, offset, limit, sort, fields, customQuery) {
      var endpoint = '/collections.json' + queryString(offset, limit, sort, fields, customQuery)
      runMethod(callback, endpoint)
    },

    'searchProduts': function (callback, term, from, size, sort, specs, brands, categories, prices, customDsl) {
      var host = 'apx-search.e-com.plus'
      // proxy will pass XGET
      // var method = 'POST'
      var endpoint = '/items.json'
      var body, msg

      if (typeof customDsl === 'object' && customDsl !== null) {
        // custom Query DSL
        // must be a valid search request body
        // https://www.elastic.co/guide/en/elasticsearch/reference/current/search-request-body.html
        body = customDsl
      } else {
        // term is required
        if (typeof term !== 'string') {
          msg = 'Search term is required and must be a string'
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
                'grid': {
                  'terms': {
                    'field': 'specs.grid',
                    'size': 12
                  },
                  'aggs': {
                    'text': {
                      'terms': {
                        'field': 'specs.text'
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
          var nestedQuery = {
            'nested': {
              'path': 'specs',
              'query': {
                'bool': {
                  'filter': []
                }
              }
            }
          }

          for (var key in specs) {
            if (Array.isArray(specs[key]) && specs[key].length > 0) {
              nestedQuery.nested.query.bool.filter.push({
                'term': {
                  'specs.grid': key
                }
              }, {
                'terms': {
                  'specs.text': specs[key]
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
          var rangeQuery = {
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

      msg = logHeader('INFO') +
        '\nQuery DSL' +
        '\n' + JSON.stringify(body)
      logger.log(msg)

      runMethod(callback, endpoint, host, body)
    },

    'listRecommendedProducts': function (callback, id) {
      if (idValidate(id)) {
        var host = 'apx-graphs.e-com.plus'
        runMethod(callback, '/products/' + id + '/recommended.json', host)
      }
    },

    'listRelatedProducts': function (callback, id) {
      if (idValidate(id)) {
        var host = 'apx-graphs.e-com.plus'
        runMethod(callback, '/products/' + id + '/related.json', host)
      }
    },

    // provide external use as http client
    'http': runMethod
  }
}
EcomIo = EcomIo()

if (isNodeJs) {
  module.exports = EcomIo
}
