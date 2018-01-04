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

  let logHeader = function (logType) {
    // common header for logger.log
    return 'E-Com Plus SDK ' + logType + ':'
  }

  let errorHandling = function (callback, errMsg, responseBody) {
    if (typeof callback === 'function') {
      let err = new Error(errMsg)
      if (responseBody === undefined) {
        // body null when error occurs before send API request
        callback(err, null)
      } else {
        callback(err, responseBody)
      }
    }
    logger.log(logHeader('WARNING') + '\n' + errMsg)
  }

  let runMethod = function (callback, endpoint, host, body) {
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
    } else {
      // host defined to Store API
      path = '/v1'
    }
    path += endpoint
    // eg.: /v1/products.json

    // retry up to 3 times if API returns 503
    let tries = 0
    sendRequest(tries, host, path, body, callback)
  }

  let sendRequest = function (tries, host, path, body, callback) {
    // send request to API
    let method
    if (!body) {
      // default to GET request
      method = 'GET'
    } else {
      // request with body
      method = 'POST'
    }

    if (isNodeJs === true) {
      // call with NodeJS http module
      let options = {
        hostname: host,
        path: path,
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'X-Store-ID': storeId
        }
      }

      let req = https.request(options, function (res) {
        if (res.statusCode === 503 && tries < 3) {
          // try to resend request
          setTimeout(function () {
            sendRequest(tries, host, path, body, callback)
          }, 500)
          // consume response data to free up memory
          res.resume()
          return
        }

        let rawData = ''
        res.setEncoding('utf8')
        res.on('data', function (chunk) {
          // buffer
          rawData += chunk
        })
        res.on('end', function () {
          // treat response
          response(res.statusCode, rawData, callback)
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
      })
    } else {
      // call with AJAX
      let ajax = new XMLHttpRequest()
      let url = 'https://' + host + path
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

  let response = function (status, data, callback) {
    // treat request response
    let body
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
      let msg
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

  let idValidate = function (callback, id) {
    // check MongoDB ObjectID
    let msg
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

  let pagination = function (callback, endpoint, offset, limit, sort, fields) {
    // a counter to verify if it is more than one url parameters and add '&' to endpoint
    let count = 0
    // number of the total current of url parameters
    let parameters = 0

    if (typeof offset !== 'undefined' && typeof offset === 'number') {
      // add more one to counter and make the number of parameters and the counter different
      count++
      // verify is is the first element or has more than one url parameters already
      if (count > 1 && count > parameters) {
        endpoint += '&offset=' + offset
        // add more one to parameters and make the number of parameters and the counter equals
        parameters++
      } else {
        // first url parameter
        endpoint += 'offset=' + offset
      }
    } else {
      // error message
      let msg = 'The offset parameter must be a number'
      errorHandling(callback, msg)
    }

    if (typeof limit !== 'undefined' && typeof limit === 'number') {
      // add more one to counter and make the number of parameters and the counter different
      count++
      // verify is is the first element or has more than one url parameters already
      if (count > 1 && count > parameters) {
        endpoint += '&limit=' + offset
        // add more one to parameters and make the number of parameters and the counter equals
        parameters++
      } else {
        // first url parameter
        endpoint += 'limit=' + offset
      }
    } else {
      // error message
      let msg = 'The limit parameter must be a number'
      errorHandling(callback, msg)
    }

    if (typeof sort !== 'undefined' && Array.isArray(sort)) {
      // add more one to counter and make the number of parameters and the counter different
      count++
      // verify is is the first element or has more than one url parameters already
      if (count > 1 && count > parameters) {
        endpoint += '&sort='
        // add more one to parameters and make the number of parameters and the counter equals
        parameters++
      } else {
        // first url parameter
        endpoint += 'sort='
      }
      for (let i = 0; i < sort.length; i++) {
        if (typeof sort[i] === 'string') {
          // verify if it is not the last element
          if (i !== sort.length - 1) {
            // escape the string to endpoint
            endpoint += escape(sort[i] + ',')
          } else {
            // escape the string to endpoint
            endpoint += escape(sort[i])
          }
        } else {
          // error message
          let msg = 'The' + sort[i] + 'is not a string'
          errorHandling(callback, msg)
          break
        }
      }
    } else {
      // error message
      let msg = 'The sort parameter must be a array of string'
      errorHandling(callback, msg)
    }

    if (typeof fields !== 'undefined' && Array.isArray(fields)) {
      // add more one to counter and make the number of parameters and the counter different
      count++
      // verify is is the first element or has more than one url parameters already
      if (count > 1 && count > parameters) {
        endpoint += '&fields='
        // add more one to parameters and make the number of parameters and the counter equals
        parameters++
      } else {
        // first url parameter
        endpoint += 'fields='
      }
      for (let i = 0; i < fields.length; i++) {
        if (typeof fields[i] === 'string') {
          // verify if it is not the last element
          if (i !== fields.length - 1) {
            // escape the string to endpoint
            endpoint += escape(fields[i] + ',')
          } else {
            // escape the string to endpoint
            endpoint += escape(fields[i])
          }
        } else {
          // error message
          let msg = 'The' + fields[i] + 'is not a string'
          errorHandling(callback, msg)
          break
        }
      }
    } else {
      // error message
      let msg = 'The fields parameter must be a array of string'
      errorHandling(callback, msg)
    }
    runMethod(callback, endpoint)
  }

  let getByField = function (callback, field, fieldName, resource, endpoint, ioMethod) {
    // common function to all getAnyByAny methods
    if (typeof field === 'string') {
      runMethod(function (err, body) {
        // replace callback
        if (!err) {
          let results = body.result
          // results must be an array of one object with _id property
          if (Array.isArray(results) && typeof results[0] === 'object' && results[0] !== null) {
            // return resource object
            ioMethod(callback, results[0]._id)
          } else {
            let msg = 'Any ' + resource + ' found with this ' + fieldName
            errorHandling(callback, msg, body)
          }
        } else {
          // only pass the error
          callback(err, body)
        }
      }, endpoint)
    } else {
      let msg = 'The' + fieldName + ' is required and must be a string'
      errorHandling(callback, msg)
    }
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
    'storeId': storeId,

    'getProduct': function (callback, id) {
      if (idValidate(callback, id)) {
        runMethod(callback, '/products/' + id + '.json')
      }
    },

    'getProductBySku': function (callback, sku) {
      let endpoint = '/products.json?sku=' + sku
      getByField(callback, sku, 'SKU', 'product', endpoint, EcomIo.getProduct)
    },

    'getOrder': function (callback, id) {
      if (idValidate(callback, id)) {
        runMethod(callback, '/orders/' + id + '.json')
      }
    },

    'getBrand': function (callback, id) {
      if (idValidate(callback, id)) {
        runMethod(callback, '/brands/' + id + '.json')
      }
    },

    'getBrandBySlug': function (callback, slug) {
      let endpoint = '/brands.json?limit=1&slug=' + slug
      getByField(callback, slug, 'slug', 'brand', endpoint, EcomIo.getBrand)
    },

    'listBrands': function (callback, offset, limit, sort, fields) {
      let endpoint = '/brands.json'
      pagination(callback, endpoint, offset, limit, sort, fields)
    },

    'getCategory': function (callback, id) {
      if (idValidate(callback, id)) {
        runMethod(callback, '/categories/' + id + '.json')
      }
    },

    'getCategoryBySlug': function (callback, slug) {
      let endpoint = '/categories.json?limit=1&slug=' + slug
      getByField(callback, slug, 'slug', 'category', endpoint, EcomIo.getCategory)
    },

    'listCategories': function (callback, offset, limit, sort, fields) {
      let endpoint = '/categories.json'
      pagination(callback, endpoint, offset, limit, sort, fields)
    },

    'getCollection': function (callback, id) {
      if (idValidate(callback, id)) {
        runMethod(callback, '/collections/' + id + '.json')
      }
    },

    'getCollectionBySlug': function (callback, slug) {
      let endpoint = '/collections.json?limit=1&slug=' + slug
      getByField(callback, slug, 'slug', 'collection', endpoint, EcomIo.getCollection)
    },

    'listCollections': function (callback, offset, limit, sort, fields) {
      let endpoint = '/collections.json'
      pagination(callback, endpoint, offset, limit, sort, fields)
    },

    'searchProduts': function (callback, term, from, size, sort, specs, brands, categories, prices, dsl) {
      let host = 'apx-search.e-com.plus'
      // proxy will pass XGET
      // let method = 'POST'
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

      runMethod(callback, endpoint, host, body)
    },

    'listRecommendedProducts': function (callback, id) {
      if (idValidate(id)) {
        let host = 'apx-graphs.e-com.plus'
        runMethod(callback, '/products/' + id + '/recommended.json', host)
      }
    },

    'listRelatedProducts': function (callback, id) {
      if (idValidate(id)) {
        let host = 'apx-graphs.e-com.plus'
        runMethod(callback, '/products/' + id + '/related.json', host)
      }
    }
  }
}
EcomIo = EcomIo()

if (isNodeJs) {
  module.exports = EcomIo
}
