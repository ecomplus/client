(function () {
  'use strict'

  var isNodeJs = false
  // Verify if the script is Node JS
  if (typeof module !== 'undefined' && module.exports) {
    isNodeJs = true
  }

  var EcomIo = (function () {
    var storeId, storeObjectId, https, logger

    if (isNodeJs && typeof XMLHttpRequest === 'undefined' && typeof XDomainRequest === 'undefined') {
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

    var runMethod = function (callback, endpoint, host, body, tries) {
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
      } else {
        switch (host) {
          case 'ioapi.ecvol.com':
            // host defined to Store API cache
            // store ID on URL, eg.: /100/v1
            path = '/' + storeId + '/v1'
            break

          case 'api.e-com.plus':
            path = '/v1'
            break

          default:
            // Storefront API, Main API, Graphs API or Search API
            // https://ecomplus.docs.apiary.io/
            // https://ecomgraphs.docs.apiary.io/
            // https://ecomsearch.docs.apiary.io/
            path = '/api/v1'
        }
      }
      path += endpoint
      // eg.: /v1/products.json

      // retry up to 3 times if API returns 503
      if (typeof tries !== 'number') {
        tries = 0
      }
      sendRequest(tries, host, path, body, callback, endpoint)

      /*
      msg = logHeader('INFO') +
        '\nAPI endpoint' +
        '\n' + endpoint
      logger.log(msg)
      */
    }

    var sendRequest = function (tries, host, path, body, callback, endpoint) {
      // send request to API
      var method
      if (!body) {
        // default to GET request
        method = 'GET'
      } else {
        // request with body
        method = 'POST'
      }
      // default request headers
      var headers = {}
      // add custom headers only when necessary
      // prevent CORS preflight request
      switch (host) {
        case 'api.e-com.plus':
        case 'apx-search.e-com.plus':
        case 'apx-graphs.e-com.plus':
          headers['X-Store-ID'] = storeId
          headers['Content-Type'] = 'application/json'
          break
      }

      var resend = function () {
        if (endpoint) {
          // tried once with error
          // try the inverse, live to cache or cache to live
          switch (host) {
            case 'ioapi.ecvol.com':
              // try with live Store API
              host = 'api.e-com.plus'
              runMethod(callback, endpoint, host, body, tries)
              return

            case 'io.ecvol.com':
              // try with live E-Com Plus Main API
              host = 'e-com.plus'
              runMethod(callback, endpoint, host, body, tries)
              return

            case 'api.e-com.plus':
              // try with cached Store API
              host = 'ioapi.ecvol.com'
              runMethod(callback, endpoint, host, body, tries)
              return

            case 'e-com.plus':
              // try with cached E-Com Plus Main API
              host = 'io.ecvol.com'
              runMethod(callback, endpoint, host, body, tries)
              return
          }
        }

        // try to resend request
        setTimeout(function () {
          sendRequest(tries, host, path, body, callback)
        }, 500)
      }

      if (https) {
        // call with NodeJS http module
        var options = {
          hostname: host,
          path: path,
          method: method,
          headers: headers
        }

        var req = https.request(options, function (res) {
          if (res.statusCode === 503 && tries < 3) {
            resend()
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
        var ajax
        if (window.XDomainRequest) {
          // IE 8,9
          ajax = new XDomainRequest()

          ajax.ontimeout = ajax.onerror = function () {
            resend()
          }
          ajax.onload = function () {
            // treat response
            response(200, this.responseText, callback)
          }
        } else {
          // supported by recent browsers
          ajax = new XMLHttpRequest()

          ajax.onreadystatechange = function () {
            if (this.readyState === 4) {
              // request finished and response is ready
              if (this.status === 503 && tries < 3) {
                resend()
              } else {
                // treat response
                response(this.status, this.responseText, callback)
              }
            }
          }
        }

        var url = 'https://' + host + path
        ajax.open(method, url, true)
        for (var header in headers) {
          if (headers.hasOwnProperty(header)) {
            ajax.setRequestHeader(header, headers[header])
          }
        }
        if (body) {
          // send JSON body
          ajax.send(JSON.stringify(body))
        } else {
          ajax.send()
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
        var host = 'ioapi.ecvol.com'
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

    var getList = function (callback, resource, offset, limit, sort, fields, customQuery) {
      // common function to all listAny methods
      var query = queryString(offset, limit, sort, fields, customQuery)
      var endpoint = '/' + resource + '.json'
      var host
      if (query === '') {
        // cacheable
        // use Cloudflare cache of Store API
        host = 'ioapi.ecvol.com'
      } else {
        endpoint += query
      }
      runMethod(callback, endpoint, host)
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
      'init': function (callback, StoreId, StoreObjectId, Logger) {
        if (typeof Logger === 'object' && Logger.hasOwnProperty('log') && Logger.hasOwnProperty('error')) {
          // log on file
          logger = Logger
        } else {
          logger = console
        }

        if (StoreId && StoreObjectId) {
          // set store ID
          storeId = StoreId
          storeObjectId = StoreObjectId

          if (typeof callback === 'function') {
            // simulate domains API response
            var body = {
              'id': null,
              'channel_id': null,
              'store_id': storeId,
              'store_object_id': storeObjectId,
              'default_lang': null
            }
            // err null
            callback(null, body)
          }
        } else {
          if (typeof location === 'object') {
            // get store ID from Main API
            // http://ecomplus.docs.apiary.io/
            var host = 'io.ecvol.com'
            var endpoint = '/domains/' + window.location.hostname + '.json'

            // middleware callback
            var Callback = function (err, body) {
              if (!err) {
                storeId = body.store_id
                storeObjectId = body.store_object_id
              }

              if (typeof callback === 'function') {
                // pass to callback
                callback(err, body)
              }
            }
            runMethod(Callback, endpoint, host)
          } else {
            var msg = 'It is necessary to specify the store ID as an init argument'
            errorHandling(callback, msg)
          }
        }
      },

      // return current store ID
      'storeId': function () {
        return storeId
      },

      // return current store object ID
      'storeObjectId': function () {
        return storeObjectId
      },

      // Store API
      // https://ecomstore.docs.apiary.io/

      'getStore': function (callback, id) {
        if (id === undefined && storeObjectId) {
          id = storeObjectId
        }
        getById(callback, 'stores', id)
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
        runMethod(callback, endpoint)
      },

      'listBrands': function (callback, offset, limit, sort, fields, customQuery) {
        getList(callback, 'brands', offset, limit, sort, fields, customQuery)
      },

      'getCategory': function (callback, id) {
        getById(callback, 'categories', id)
      },

      'findCategoryBySlug': function (callback, slug) {
        var endpoint = '/categories.json?limit=1&slug=' + slug
        runMethod(callback, endpoint)
      },

      'listCategories': function (callback, offset, limit, sort, fields, customQuery) {
        getList(callback, 'categories', offset, limit, sort, fields, customQuery)
      },

      'getCollection': function (callback, id) {
        getById(callback, 'collections', id)
      },

      'findCollectionBySlug': function (callback, slug) {
        var endpoint = '/collections.json?limit=1&slug=' + slug
        runMethod(callback, endpoint)
      },

      'listCollections': function (callback, offset, limit, sort, fields, customQuery) {
        getList(callback, 'collections', offset, limit, sort, fields, customQuery)
      },

      // fallback
      'getById': getById,

      // Search API
      // https://ecomsearch.docs.apiary.io/

      'searchProducts': function (callback, term, from, size, sort, specs, ids, brands, categories, prices, dsl) {
        var host = 'apx-search.e-com.plus'
        // proxy will pass XGET
        // var method = 'POST'
        var endpoint = '/items.json'
        var body

        if (typeof dsl === 'object' && dsl !== null) {
          // custom Query DSL
          // must be a valid search request body
          // https://www.elastic.co/guide/en/elasticsearch/reference/current/search-request-body.html
          body = dsl
        } else {
          /*
          // term is required
          if (typeof term !== 'string') {
            msg = 'Search term is required and must be a string'
            errorHandling(callback, msg)
            return
          }
          */

          if (typeof sort === 'number') {
            // defines most common sorting options
            switch (sort) {
              case 1:
                // sort by sales
                sort = {
                  'sales': {
                    'order': 'desc'
                  }
                }
                break

              case 2:
                // sort by price
                // lowest price -> highest price
                sort = {
                  'price': {
                    'order': 'asc'
                  }
                }
                break

              case 3:
                // sort by price
                // highest price -> lowest price
                sort = {
                  'price': {
                    'order': 'desc'
                  }
                }
                break

              default:
                // default sort by views
                sort = {
                  'views': {
                    'order': 'desc'
                  }
                }
            }
          } else if (!sort) {
            // default sort by views
            sort = {
              'views': {
                'order': 'desc'
              }
            }
          }

          body = {
            'query': {
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
            'sort': [
              {
                'available': {
                  'order': 'desc'
                }
              },
              '_score',
              {
                'ad_relevance': {
                  'order': 'desc'
                }
              },
              sort
            ],
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

          // search term
          if (typeof term === 'string') {
            // https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-multi-match-query.html
            body.query.bool.must = {
              'multi_match': {
                'query': term,
                'fields': [
                  'name',
                  'keywords'
                ]
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

          if (Array.isArray(ids) && ids.length > 0) {
            // add filter
            // search by product Object IDs
            body.query.bool.filter.push({
              'terms': {
                '_id': ids
              }
            })
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

        /*
        msg = logHeader('INFO') +
          '\nQuery DSL' +
          '\n' + JSON.stringify(body)
        logger.log(msg)
        */
        runMethod(callback, endpoint, host, body)
      },

      // Storefront API
      // no documentation yet

      'mapBySlug': function (callback, slug) {
        // returns resource and ID
        var host = 'iostorefront.ecvol.com'
        // replace / with $ on slug to escape URL
        var endpoint = '/' + storeId + '@' + slug.replace('/', '$') + '.json'

        // middleware callback
        var Callback = function (err, body) {
          if (!err) {
            var val = body.GET
            if (val) {
              /*
              {
                "GET": "[resource]@[id]"
              }
              */
              val = val.split('@')
              // overwrite body
              body = {
                'resource': val[0],
                '_id': val[1]
              }

              // success, pass the object
              callback(null, body)
            } else {
              // Redis key not found
              body = {
                'status': 404,
                'error_code': -44,
                'message': 'Page not found, invalid slug or store ID'
              }
              var msg = body.message
              errorHandling(callback, msg, body)
            }
          } else {
            // just pass the error
            callback(err, body)
          }
        }

        runMethod(Callback, endpoint, host)
      },

      'mapByWindowUri': function (callback) {
        // convenience only
        if (typeof location === 'object') {
          // remove the first / char from pathname
          var slug = window.location.pathname.slice(1)
          EcomIo.mapBySlug(callback, slug)
        } else {
          // on browser only
          var msg = 'This method is available client side only (JS on browser)'
          errorHandling(callback, msg)
        }
      },

      // Graphs API
      // https://ecomgraphs.docs.apiary.io/

      'listRecommendedProducts': function (callback, id) {
        if (idValidate(id)) {
          var host = 'apx-graphs.e-com.plus'
          var endpoint = '/products/' + id + '/recommended.json'
          runMethod(callback, endpoint, host)
        }
      },

      'listRelatedProducts': function (callback, id) {
        if (idValidate(id)) {
          var host = 'apx-graphs.e-com.plus'
          var endpoint = '/products/' + id + '/related.json'
          runMethod(callback, endpoint, host)
        }
      },

      // provide external use as http client
      'http': runMethod
    }
  }())

  if (isNodeJs) {
    module.exports = EcomIo
  } else {
    // declare globally
    window.EcomIo = EcomIo
  }
}())
