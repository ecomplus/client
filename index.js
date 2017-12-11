var storeID

// GET STORE ID
(function storeId (storeId) {
  storeID = storeId
}())

// Function to verify if the script is Node JS
function NodeJS () {
  // Establish the root object, `window` in the browser, or `global` on the server.
  var root = this
  // Create a reference to this
  var _ = {}

  var isNode = false
  // Export the Underscore object for **CommonJS**, with backwards-compatibility
  // for the old `require()` API. If we're not in CommonJS, add `_` to the
  // global object.
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = _
    root._ = _
    isNode = true
  } else {
    root._ = _
  }
  return isNode
}

// Function to run function by endpoint and method
function runMethod (endpoint, method) {
  if (NodeJS() === true) {
    var request = require('request')
    request({
      method: method,
      url: 'https://api.e-com.plus/v1' + endpoint,
      headers: {
        'Content-Type': 'application/json',
        'X-Store-ID': storeID
      }
    }, function (error, res, body) {
      if (error) {
        console.log('Error:', error)
      } else {
        return res.body
      }
    })
  } else {
    var ajax = new XMLHttpRequest()
    var url = 'https://api.e-com.plus/v1' + endpoint
    ajax.open(method, url, true)
    ajax.send()
    ajax.onreadystatechange = function () {
      if (ajax.readyState === 4 && ajax.status === 200) {
        var data = ajax.responseText
        return data
      }
    }
  }
}

// Function to get Id product by sku
function getProductIdBySku (sku) {
  var endpoint = '/products.json?sku=' + sku
  var method = 'GET'
  var id = runMethod(endpoint, method).done(function () {
    getProductbyIDroduct(id)
  })
}

// Function to get Product by id
function getProduct (id) {
  var endpoint = '/products/' + id + '.json'
  var method = 'GET'
  runMethod(endpoint, method)
}
